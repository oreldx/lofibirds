import type { ChannelId, ChannelLoadState, ChannelSettings, GardenPreferences, PlaybackState } from '../types'
import { createAmbienceLoop } from './ambience'

const FADE = 0.1
const LOOKAHEAD = 180

interface Channel {
  id: ChannelId
  urls: readonly string[]
  settings: ChannelSettings
  load: ChannelLoadState
  buffers?: AudioBuffer[]
  pending?: Promise<void>
  gain?: GainNode
  sources: Map<AudioBufferSourceNode, { start: number; envelope: GainNode }>
  nextStart?: number
  generation: number
}

export interface AudioSnapshot {
  playback: PlaybackState
  error: string | null
  channels: Record<ChannelId, ChannelLoadState>
}

export interface AudioDependencies {
  createContext: () => AudioContext
  load: (url: string) => Promise<ArrayBuffer>
  random: () => number
}

const browserDependencies: AudioDependencies = {
  createContext: () => new AudioContext(),
  load: async (url) => {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.arrayBuffer()
  },
  random: Math.random,
}

/** Une session audio ; aucun accès à Vue, aux composants ou au document. */
export class GardenAudioEngine {
  private readonly channels: Channel[]
  private readonly cache = new Map<string, Promise<AudioBuffer>>()
  private readonly allSources = new Map<AudioBufferSourceNode, GainNode>()
  private readonly ramps = new WeakMap<AudioParam, { from: number; to: number; start: number; end: number }>()
  private context?: AudioContext
  private output?: GainNode
  private timer?: ReturnType<typeof setInterval>
  private wanted = false
  private disposed = false
  private generation = 0
  private playback: PlaybackState = 'stopped'
  private error: string | null = null

  constructor(
    assets: Record<ChannelId, readonly string[]>,
    preferences: GardenPreferences,
    private readonly publish: (snapshot: AudioSnapshot) => void,
    private readonly dependencies: AudioDependencies = browserDependencies,
  ) {
    this.channels = (Object.entries(assets) as [ChannelId, readonly string[]][]).map(([id, urls]) => ({
      id, urls, settings: { ...(id === 'ambience' ? preferences.ambience : preferences.species[id]) },
      load: { status: 'idle' }, sources: new Map(), generation: 0,
    }))
    this.notify()
  }

  async play(): Promise<void> {
    if (this.disposed || (this.wanted && (this.playback === 'playing' || this.playback === 'starting'))) return
    const generation = ++this.generation
    this.wanted = true
    this.playback = 'starting'
    this.error = null
    this.notify()
    try {
      // Création et resume avant toute attente : conserver le geste utilisateur.
      const context = this.ensureContext()
      await context.resume()
      if (!this.wanted || this.disposed || generation !== this.generation) return
      if (context.state !== 'running') throw new Error('Le navigateur a interrompu l’écoute. Réessayez pour la reprendre.')
      this.playback = 'playing'
      this.beginScheduling()
      this.notify()
    } catch {
      if (this.disposed || generation !== this.generation) return
      this.wanted = false
      this.cancelScheduling(false)
      this.playback = 'paused'
      this.error = 'L’écoute n’a pas pu démarrer. Vérifiez que votre navigateur autorise le son, puis réessayez.'
      this.notify()
    }
  }

  pause(): void {
    if (this.disposed) return
    this.wanted = false
    this.generation++
    this.cancelScheduling(true)
    this.playback = 'paused'
    this.error = null
    this.notify()
  }

  setChannel(id: ChannelId, settings: ChannelSettings): void {
    if (this.disposed) return
    const channel = this.channel(id)
    const changed = channel.settings.enabled !== settings.enabled
    channel.settings = { enabled: settings.enabled, volume: this.volume(settings.volume) }
    if (changed) {
      channel.generation++
      if (!settings.enabled) this.stopChannel(channel, true)
      else if (this.playback === 'playing') this.activate(channel)
    } else if (channel.gain && this.context) {
      this.ramp(channel.gain.gain, settings.enabled ? channel.settings.volume : 0)
    }
  }

  retry(id: ChannelId): void {
    if (this.disposed) return
    const channel = this.channel(id)
    if (!channel.settings.enabled || channel.load.status !== 'error') return
    channel.load = { status: 'idle' }
    this.notify()
    // Un clic de nouvelle tentative ne lance pas une session arrêtée.
    if (this.playback === 'playing') this.activate(channel)
  }

  async destroy(): Promise<void> {
    if (this.disposed) return
    this.disposed = true
    this.wanted = false
    this.generation++
    this.cancelScheduling(false)
    for (const [source, envelope] of this.allSources) {
      source.stop()
      source.disconnect()
      envelope.disconnect()
      source.onended = null
    }
    this.allSources.clear()
    if (this.context) {
      this.context.removeEventListener('statechange', this.onContextState)
      for (const channel of this.channels) channel.gain?.disconnect()
      this.output?.disconnect()
      await this.context.close()
    }
    this.cache.clear()
    for (const channel of this.channels) channel.buffers = undefined
  }

  private channel(id: ChannelId): Channel {
    const channel = this.channels.find((entry) => entry.id === id)
    if (!channel) throw new Error(`Canal inconnu : ${id}`)
    return channel
  }

  private volume(value: number): number {
    return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0
  }

  private notify(): void {
    if (this.disposed) return
    this.publish({
      playback: this.playback, error: this.error,
      channels: Object.fromEntries(this.channels.map((channel) => [channel.id, { ...channel.load }])) as Record<ChannelId, ChannelLoadState>,
    })
  }

  private ensureContext(): AudioContext {
    if (this.context) return this.context
    const context = this.dependencies.createContext()
    this.context = context
    this.output = context.createGain()
    // Marge pour six canaux à 100 %, même si leurs crêtes coïncident.
    this.output.gain.value = 1 / this.channels.length
    this.output.connect(context.destination)
    for (const channel of this.channels) {
      channel.gain = context.createGain()
      channel.gain.gain.value = 0
      channel.gain.connect(this.output)
    }
    context.addEventListener('statechange', this.onContextState)
    return context
  }

  private readonly onContextState = (): void => {
    if (!this.wanted || this.disposed || !this.context || this.playback === 'starting') return
    if (this.context.state === 'running') {
      if (this.playback === 'interrupted') {
        this.playback = 'playing'
        this.beginScheduling()
        this.notify()
      }
    } else {
      this.cancelScheduling(false)
      this.playback = 'interrupted'
      this.notify()
    }
  }

  private beginScheduling(): void {
    if (this.timer !== undefined) clearInterval(this.timer)
    for (const channel of this.channels) if (channel.settings.enabled) this.activate(channel)
    this.timer = setInterval(() => this.schedule(), 1000)
  }

  private activate(channel: Channel): void {
    const generation = channel.generation
    void this.loadChannel(channel).then(() => {
      if (this.disposed || this.playback !== 'playing' || !channel.settings.enabled || generation !== channel.generation || !channel.buffers) return
      if (channel.sources.size > 0) return
      this.ramp(channel.gain!.gain, channel.settings.volume)
      if (channel.id === 'ambience') {
        this.startSource(channel, channel.buffers[0]!, this.context!.currentTime + FADE, true)
      } else {
        channel.nextStart = this.firstStart()
        this.scheduleChannel(channel)
      }
    })
  }

  private async loadChannel(channel: Channel): Promise<void> {
    if (channel.buffers || channel.load.status === 'error') return
    if (channel.pending) return channel.pending
    channel.load = { status: 'loading' }
    this.notify()
    channel.pending = (async () => {
      try {
        if (!channel.urls.length) throw new Error('Aucun extrait disponible.')
        const context = this.context!
        const buffers = await Promise.all(channel.urls.map((url) => this.loadBuffer(url, context)))
        if (this.disposed) return
        channel.buffers = channel.id === 'ambience' ? [createAmbienceLoop(context, buffers[0]!)] : buffers
        channel.load = { status: 'ready' }
      } catch {
        if (this.disposed) return
        channel.load = { status: 'error', message: channel.id === 'ambience' ? 'L’ambiance n’a pas pu être chargée.' : 'Le chant n’a pas pu être chargé.' }
      } finally {
        channel.pending = undefined
        this.notify()
      }
    })()
    return channel.pending
  }

  private loadBuffer(url: string, context: AudioContext): Promise<AudioBuffer> {
    const existing = this.cache.get(url)
    if (existing) return existing
    const pending = this.dependencies.load(url).then((bytes) => {
      if (this.disposed) throw new Error('Session terminée.')
      return context.decodeAudioData(bytes)
    }).then((buffer) => {
      if (!Number.isFinite(buffer.duration) || buffer.duration <= 0 || buffer.length < 1) throw new Error('Extrait audio invalide.')
      return buffer
    }).catch((error: unknown) => {
      this.cache.delete(url)
      throw error
    })
    this.cache.set(url, pending)
    return pending
  }

  private firstStart(): number {
    return this.context!.currentTime + 0.2 + this.dependencies.random() * 5.8
  }

  private schedule(): void {
    if (this.disposed || this.playback !== 'playing' || this.context?.state !== 'running') return
    for (const channel of this.channels) {
      if (channel.settings.enabled && channel.id !== 'ambience' && channel.buffers) this.scheduleChannel(channel)
    }
  }

  private scheduleChannel(channel: Channel): void {
    const now = this.context!.currentTime
    // Aucun rattrapage des départs manqués si le thread a été gelé longtemps.
    if (channel.nextStart === undefined || channel.nextStart < now) channel.nextStart = this.firstStart()
    while (channel.nextStart < now + LOOKAHEAD) {
      const buffers = channel.buffers!
      const index = Math.min(buffers.length - 1, Math.floor(this.dependencies.random() * buffers.length))
      const buffer = buffers[index]!
      this.startSource(channel, buffer, channel.nextStart)
      channel.nextStart += buffer.duration + 8 + this.dependencies.random() * 17
    }
  }

  private startSource(channel: Channel, buffer: AudioBuffer, when: number, loop = false): void {
    const source = this.context!.createBufferSource()
    const envelope = this.context!.createGain()
    source.buffer = buffer
    source.loop = loop
    envelope.gain.value = 0
    envelope.gain.setValueAtTime(0, when)
    envelope.gain.linearRampToValueAtTime(1, when + FADE)
    this.ramps.set(envelope.gain, { from: 0, to: 1, start: when, end: when + FADE })
    source.connect(envelope)
    envelope.connect(channel.gain!)
    source.onended = () => {
      channel.sources.delete(source)
      this.allSources.delete(source)
      source.disconnect()
      envelope.disconnect()
    }
    channel.sources.set(source, { start: when, envelope })
    this.allSources.set(source, envelope)
    source.start(when)
  }

  private ramp(param: AudioParam, target: number): void {
    const now = this.context!.currentTime
    const previous = this.ramps.get(param)
    const held = previous
      ? previous.from + (previous.to - previous.from) * Math.max(0, Math.min(1, (now - previous.start) / (previous.end - previous.start)))
      : param.value
    // Compatible aussi avec les navigateurs sans cancelAndHoldAtTime.
    param.cancelScheduledValues(now)
    param.setValueAtTime(held, now)
    param.linearRampToValueAtTime(target, now + FADE)
    this.ramps.set(param, { from: held, to: target, start: now, end: now + FADE })
  }

  private stopChannel(channel: Channel, fade: boolean): void {
    const context = this.context
    if (context && channel.gain) {
      const stopTime = context.currentTime + (fade && context.state === 'running' ? FADE : 0)
      if (fade) this.ramp(channel.gain.gain, 0)
      else {
        channel.gain.gain.cancelScheduledValues(context.currentTime)
        channel.gain.gain.setValueAtTime(0, context.currentTime)
        this.ramps.delete(channel.gain.gain)
      }
      for (const [source, { start, envelope }] of channel.sources) {
        if (fade && start <= context.currentTime) this.ramp(envelope.gain, 0)
        source.stop(start > context.currentTime ? context.currentTime : stopTime)
        // Les callbacks ended restent responsables de déconnecter les sources.
      }
    }
    channel.sources.clear()
    channel.nextStart = undefined
  }

  private cancelScheduling(fade: boolean): void {
    if (this.timer !== undefined) clearInterval(this.timer)
    this.timer = undefined
    for (const channel of this.channels) {
      channel.generation++
      this.stopChannel(channel, fade)
    }
  }
}

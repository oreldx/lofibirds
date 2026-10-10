import type { ScenePosition, SpeciesId } from '../types'

const LOOKAHEAD = 180
const START_MARGIN = 0.2
const PHASE_GAPS = {
  calm: [12, 20],
  normal: [6, 12],
  lively: [2, 6],
} as const

type Phase = keyof typeof PHASE_GAPS

interface PhaseWindow {
  phase: Phase
  start: number
  end: number
}

export interface SchedulableBird {
  id: SpeciesId
  durations: readonly number[]
  position: ScenePosition
}

export interface BirdEvent {
  species: SpeciesId
  clip: number
  start: number
  end: number
  rest: number
  nextStart: number
  gain: number
  pan: number
}

interface BirdMemory {
  lastStart: number
  lastClip?: number
  plays: number
  lastUse: Map<number, number>
  readyAt: number
}

interface ScheduleState {
  memory: Map<SpeciesId, BirdMemory>
  active: BirdEvent[]
  nextStart: number
}

/** Planification purement temporelle : aucune dépendance à Web Audio ou au DOM. */
export class BirdScheduler {
  private committed: ScheduleState = { memory: new Map(), active: [], nextStart: 0 }
  private future: BirdEvent[] = []
  private phases: PhaseWindow[] = []

  constructor(private readonly random: () => number) {}

  reset(now: number): void {
    this.committed = { memory: new Map(), active: [], nextStart: now + START_MARGIN }
    this.future = []
    this.phases = [this.createPhase('normal', now)]
  }

  /** L'horloge, et non les callbacks ended, détermine les chants déjà joués. */
  advance(now: number): void {
    let played = 0
    for (const event of this.future) {
      if (event.start > now) break
      this.apply(this.committed, event)
      played++
    }
    this.future.splice(0, played)
    this.committed.active = this.committed.active.filter((event) => event.end > now)

    const last = this.phases.at(-1)
    if (!last) {
      this.phases = [this.createPhase('normal', now)]
    } else if (last.end <= now) {
      // Un long gel ne doit pas faire défiler des phases historiques en rafale.
      this.phases = [this.createPhase(this.nextPhase(last.phase), now)]
    } else {
      this.phases = this.phases.filter((window) => window.end > now)
    }
  }

  replan(now: number): void {
    this.advance(now)
    // La mémoire spéculative des événements annulés n'a jamais été validée.
    this.future = []
  }

  stopSpecies(id: SpeciesId, now: number, stopAt: number): void {
    this.advance(now)
    this.committed.active = this.committed.active.map((event) => {
      if (event.species !== id || event.end <= stopAt) return event
      this.memory(this.committed, id).readyAt = stopAt + event.rest
      return { ...event, end: stopAt }
    })
  }

  /** Renvoie uniquement les événements nouvellement ajoutés à l'horizon. */
  extend(now: number, birds: readonly SchedulableBird[]): BirdEvent[] {
    this.advance(now)
    const horizon = now + LOOKAHEAD
    this.extendPhases(horizon)
    const available = birds.filter((bird) => bird.durations.length > 0)
    if (!available.length) return []

    const state = this.copyState()
    for (const event of this.future) this.apply(state, event)
    const added: BirdEvent[] = []
    let when = Math.max(now + START_MARGIN, state.nextStart)

    while (when < horizon) {
      state.active = state.active.filter((event) => event.end > when)
      if (state.active.length >= 2) {
        when = Math.min(...state.active.map((event) => event.end))
        continue
      }

      const eligible = available.filter((bird) => this.memory(state, bird.id).readyAt <= when)
      if (!eligible.length) {
        when = Math.min(...available.map((bird) => this.memory(state, bird.id).readyAt))
        continue
      }

      const oldest = Math.min(...eligible.map((bird) => this.memory(state, bird.id).lastStart))
      const fair = eligible.filter((bird) => this.memory(state, bird.id).lastStart === oldest)
      const bird = fair[Math.floor(this.draw() * fair.length)]!
      const clip = this.selectClip(this.memory(state, bird.id), bird.durations.length)
      const gap = PHASE_GAPS[this.phaseAt(when)]
      const event: BirdEvent = {
        species: bird.id,
        clip,
        start: when,
        end: when + bird.durations[clip]!,
        rest: this.between(8, 25),
        nextStart: when + this.between(gap[0], gap[1]),
        gain: Math.min(1, (0.85 + 0.15 * bird.position.y) * this.between(0.95, 1.05)),
        pan: Math.max(-1, Math.min(1, 0.6 * (2 * bird.position.x - 1) + this.between(-0.05, 0.05))),
      }
      this.apply(state, event)
      this.future.push(event)
      added.push(event)
      when = state.nextStart
    }
    return added
  }

  private copyState(): ScheduleState {
    return {
      memory: new Map([...this.committed.memory].map(([id, memory]) => [
        id, { ...memory, lastUse: new Map(memory.lastUse) },
      ])),
      active: [...this.committed.active],
      nextStart: this.committed.nextStart,
    }
  }

  private memory(state: ScheduleState, id: SpeciesId): BirdMemory {
    let memory = state.memory.get(id)
    if (!memory) {
      memory = { lastStart: -Infinity, plays: 0, lastUse: new Map(), readyAt: -Infinity }
      state.memory.set(id, memory)
    }
    return memory
  }

  private apply(state: ScheduleState, event: BirdEvent): void {
    const memory = this.memory(state, event.species)
    memory.plays++
    memory.lastStart = event.start
    memory.lastClip = event.clip
    memory.lastUse.set(event.clip, memory.plays)
    memory.readyAt = event.end + event.rest
    state.active = state.active.filter((active) => active.end > event.start)
    state.active.push(event)
    state.nextStart = event.nextStart
  }

  private selectClip(memory: BirdMemory, count: number): number {
    const candidates = Array.from({ length: count }, (_, clip) => ({
      clip,
      weight: memory.plays - (memory.lastUse.get(clip) ?? 0) + 1,
    })).filter(({ clip }) => count === 1 || clip !== memory.lastClip)
    let target = this.draw() * candidates.reduce((sum, candidate) => sum + candidate.weight, 0)
    for (const candidate of candidates) {
      target -= candidate.weight
      if (target < 0) return candidate.clip
    }
    return candidates.at(-1)!.clip
  }

  private extendPhases(until: number): void {
    let last = this.phases.at(-1)!
    while (last.end < until) {
      last = this.createPhase(this.nextPhase(last.phase), last.end)
      this.phases.push(last)
    }
  }

  private phaseAt(when: number): Phase {
    return this.phases.find((window) => window.start <= when && when < window.end)!.phase
  }

  private createPhase(phase: Phase, start: number): PhaseWindow {
    return { phase, start, end: start + this.between(120, 240) }
  }

  private nextPhase(previous: Phase): Phase {
    const candidates = (Object.keys(PHASE_GAPS) as Phase[]).filter((phase) => phase !== previous)
    return candidates[Math.floor(this.draw() * candidates.length)]!
  }

  private between(min: number, max: number): number {
    return min + this.draw() * (max - min)
  }

  private draw(): number {
    return Math.max(0, Math.min(1 - Number.EPSILON, this.random()))
  }
}

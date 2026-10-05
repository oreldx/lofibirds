/** Assemble un raccord tail/head complémentaire, sans changer la vitesse. */
export function createAmbienceLoop(context: Pick<AudioContext, 'createBuffer'>, buffer: AudioBuffer): AudioBuffer {
  const overlap = Math.min(Math.round(buffer.sampleRate), Math.floor(buffer.length / 2))
  if (overlap < 1) throw new Error('Ambiance trop courte.')
  const length = buffer.length - overlap
  const loop = context.createBuffer(buffer.numberOfChannels, length, buffer.sampleRate)
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const input = buffer.getChannelData(channel)
    const output = loop.getChannelData(channel)
    output.set(input.subarray(overlap, length))
    for (let index = 0; index < overlap; index++) {
      const mix = overlap === 1 ? 0.5 : index / (overlap - 1)
      output[length - overlap + index] = input[length + index]! * (1 - mix) + input[index]! * mix
    }
  }
  return loop
}

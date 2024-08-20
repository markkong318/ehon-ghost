export namespace AudioUtil {
  export function playAudio(voice: AudioBuffer, audioContext: AudioContext) {
    const source = audioContext.createBufferSource();
    source.buffer = voice;
    source.connect(audioContext.destination);
    source.start(0);
  }
}


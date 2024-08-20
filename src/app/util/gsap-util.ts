import {gsap} from 'gsap';
import {DisplayObject} from 'pixi.js';
import {AudioUtil} from './audio-util';

export namespace GsapUtil {
  export function toWait(tl: gsap.core.Timeline, duration: number = 0.75) {
    tl.add(function () {
    }, `+=${duration}`);
  }

  export function toVoice(tl: gsap.core.Timeline, voice: AudioBuffer, audioContext: AudioContext) {
    tl.to(null, {
      duration: voice.duration,
      onStart: function (voice: AudioBuffer, audioContext: AudioContext) {
        AudioUtil.playAudio(voice, audioContext);
      },
      onStartParams: [voice, audioContext],
    });
  }

  export function toTextVoice(tl: gsap.core.Timeline, object: DisplayObject, x: number, duration: number, voice: AudioBuffer, audioContext: AudioContext) {
    tl.to(object, {
      x,
      duration,
      onStart: async function (voice: AudioBuffer, audioContext: AudioContext) {
        AudioUtil.playAudio(voice, audioContext);
      },
      onStartParams: [voice, audioContext],
    });
  }

  export function toFadeIn(tl: gsap.core.Timeline, object: DisplayObject) {
    tl.to(object, {alpha: 1, duration: 1});
  }

  export function toFadeOut(tl: gsap.core.Timeline, object: DisplayObject) {
    tl.to(object, {alpha: 0, duration: 1});
  }
}

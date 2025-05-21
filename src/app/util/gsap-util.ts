import { gsap } from 'gsap';
import { DisplayObject, Sprite } from 'pixi.js';
import { AudioUtil } from './audio-util';

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

  export function toTextsVoice(tl: gsap.core.Timeline, objects: Sprite[], xs: number[], voice: AudioBuffer, audioContext: AudioContext) {
    console.log(voice);
    const duration = voice.duration;
    console.log(xs)

    let objectLength = 0;
    for (let i = 0; i < objects.length; i++) {
      objectLength += objects[i].width + xs[i];
    }

    console.log(objects);
    // console.log(segmentDuration);

    for (let i = 0; i < objects.length; i++) {
      const object = objects[i];
      const targetX = xs[i];

      const segmentDuration = duration * ((objects[i].width + xs[i]) / objectLength);

      console.log(segmentDuration);

      tl.to(
        object,
        {
          x: targetX,
          ease: 'none',
          duration: segmentDuration,
          onStart: async function (voice: AudioBuffer, audioContext: AudioContext) {
            if (i === 0) { // Play audio only for the first object
              AudioUtil.playAudio(voice, audioContext);
            }
          },
          onStartParams: [voice, audioContext],
        },
        `-=0.2`
      );
    }
  }

  export function toFadeIn(tl: gsap.core.Timeline, object: DisplayObject) {
    tl.to(object, { alpha: 1, duration: 1 });
  }

  export function toFadeOut(tl: gsap.core.Timeline, object: DisplayObject) {
    tl.to(object, { alpha: 0, duration: 1 });
  }
}

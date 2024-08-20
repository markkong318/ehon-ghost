import * as PIXI from 'pixi.js';

import {Size} from './size';
import {Background} from './background';

export class View extends PIXI.Container {
  private backgroundSprite: PIXI.Sprite;

  public background: Background;
  public size: Size;

  constructor() {
    super();

    return new Proxy(this, {
      get: function (oTarget, sKey, receiver) {
        const descriptor = Object.getOwnPropertyDescriptor(oTarget, sKey);
        if (descriptor?.value?.bottle) {
          return descriptor.value();
        }
        return Reflect.get(oTarget, sKey, receiver);
      },
      set: function (oTarget, sKey, value, receiver) {
        if (typeof value === 'object' && value !== null) {
          if (value.setView) {
            value.setView(oTarget);
          }
        }

        return Reflect.set(oTarget, sKey, value, receiver)
      },
    });
  }

  init() {
    console.log("init view")
  }

  initBackground() {
    if (!this.size) {
      return;
    }

    this.backgroundSprite = new PIXI.Sprite(this.background._texture);
    this.backgroundSprite.width = this.size.width;
    this.backgroundSprite.height = this.size.height;
    this.backgroundSprite.tint = this.background._tint;
    this.addChild(this.backgroundSprite);
  }
}

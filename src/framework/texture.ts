import * as PIXI from 'pixi.js';

export class Texture {
  private caches: Map<string, PIXI.Texture>;

  constructor() {
    this.caches = new Map();

    return new Proxy(this, {
      get: function (oTarget, sKey, receiver) {
        console.log('texture sKey: ' + String(sKey))

        const descriptor = Object.getOwnPropertyDescriptor(oTarget, sKey);
        if (descriptor?.value?.bottle) {
          return descriptor.value();
        }

        const prototypeDescriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(oTarget), sKey)
        if (prototypeDescriptor?.get) {
          if (oTarget.caches.has(String(sKey))) {
            return oTarget.caches.get(String(sKey));
          }

          const obj = prototypeDescriptor.get.bind(receiver)();
          oTarget.caches.set(String(sKey), obj);

          return obj;
        }

        return Reflect.get(oTarget, sKey, receiver);
      },
    });
  }

  initBottle() {
  }
}

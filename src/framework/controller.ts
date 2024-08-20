export class Controller {
  constructor() {
    return new Proxy(this, {
      get: function (oTarget, sKey, receiver) {
        const descriptor = Object.getOwnPropertyDescriptor(oTarget, sKey);
        if (descriptor?.value?.bottle) {
          return descriptor.value();
        }
        return Reflect.get(oTarget, sKey, receiver);
      },
    });
  }
}

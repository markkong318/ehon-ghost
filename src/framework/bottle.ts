export default new class Bottle {
  private map: Map<any, any>

  constructor() {
    this.map = new Map<any, any>()

  }

  setObject(obj: any, key?: string) {
    if (obj.constructor.name === 'Function') {
      throw new Error('Argument is not a object');
    }

    // console.log('[bottle] set object ' + obj.constructor.name)

    this.set(key ? key : obj.constructor.name, obj)
  }

  getObject(obj: any, key?: string) {
    if (typeof obj === 'string') {
      return this.get(obj);
    }

    if (obj && !obj.name) {
      throw new Error('Argument is not a class');
    }

    // console.log('[bottle] get object ' + obj.name)

    return this.get(key ? key : obj.name);
  }

  set(key, vale) {
    // console.log('[bottle] set ' + key);

    this.map.set(key, vale);
  }

  get(key) {
    // console.log('[bottle] get ' + key);

    if (!this.map.has(key)) {
      throw new Error(`Could not find ${key}`);
    }

    return this.map.get(key);
  }

  inject(srcClass: { new(...any): any } | string): any {
    const func = () => this.getObject(srcClass);
    func.bottle = true;

    return func;
  }

  singleton(srcClass: { new(...any): any }, options?: { key?: string, args?: any[] }): any {
    const {key, args = []} = options || {};

    if (!srcClass.name) {
      throw new Error('Argument is not a class');
    }

    if (this.map.has(key ? key : srcClass.name)) {
      // console.log(`[bottle] set singleton ${srcClass.name}, skip`);
      return this.get(key ? key : srcClass.name);
    }

    // @ts-ignore
    const obj = new srcClass(...args);
    obj.initBottle && obj.initBottle();

    // console.log('[bottle] set singleton ' + obj.constructor.name);

    this.set(key ? key : srcClass.name, obj);

    return obj;
  }
}();

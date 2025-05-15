import * as PIXI from 'pixi.js';

export class LineSprite {
  public get() {
    const g = new PIXI.Graphics();

    g.lineStyle(2,0x000000).moveTo(0,0).lineTo(480,0);

    return g;
  }
}

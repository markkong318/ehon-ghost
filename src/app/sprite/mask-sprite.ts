import * as PIXI from 'pixi.js';

export class MaskSprite {

  public static readonly WIDTH: number = 530;
  public static readonly HEIGHT: number = 43;
  public static readonly GRADIENT_WIDTH: number = 50;

  private sprite: PIXI.Sprite;

  public get() {
    if (this.sprite) {
      return this.sprite;
    }

    const canvas = document.createElement('canvas');
    canvas.width = MaskSprite.WIDTH;
    canvas.height = MaskSprite.HEIGHT;

    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, MaskSprite.WIDTH - MaskSprite.GRADIENT_WIDTH, MaskSprite.HEIGHT)

    const grd = ctx.createLinearGradient(MaskSprite.WIDTH - MaskSprite.GRADIENT_WIDTH, 0, MaskSprite.WIDTH, 0);
    grd.addColorStop(0, 'white');
    grd.addColorStop(1, 'black');

    ctx.fillStyle = grd;
    ctx.fillRect(MaskSprite.GRADIENT_WIDTH, 0, MaskSprite.WIDTH, MaskSprite.HEIGHT);

    const gradient = PIXI.Texture.from(canvas);

    this.sprite = new PIXI.Sprite(gradient);

    return this.sprite;
  }
}

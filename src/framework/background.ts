import * as PIXI from 'pixi.js';
import { View } from './view';

export class Background {
  public _texture: PIXI.Texture = PIXI.Texture.WHITE;
  public _tint: number = 0xffffff;

  private view: View;
  private sprite: PIXI.Sprite;

  set texture(texture: PIXI.Texture) {
    this._texture = texture;
    this.render();
  }

  set tint(tint: number) {
    this._tint = tint;
    this.render();
  }

  constructor(texture: PIXI.Texture, tint: number) {
    this._texture = texture;
    this._tint = tint;
  }

  setView(view: View) {
    this.view = view;

    if (this.sprite && this.view !== view) {
      this.view.removeChild(this.sprite);
    }

    this.render();
  }

  render() {
    if (!this.view.size) {
      return;
    }

    if (!this.sprite) {
      this.sprite = new PIXI.Sprite(this._texture);
      this.view.addChild(this.sprite);
    }

    this.sprite.width = this.view.size.width;
    this.sprite.height = this.view.size.height;
    this.sprite.tint = this._tint;
  }
}

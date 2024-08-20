import * as PIXI from 'pixi.js';
import {Background} from '../../framework/background';
import {View} from '../../framework/view';

export class LoadingView extends View {
  public init() {
    this.background = new Background(PIXI.Texture.WHITE, 0x000000);
  }
}

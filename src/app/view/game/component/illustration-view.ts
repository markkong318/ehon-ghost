import { gsap } from 'gsap';
import * as PIXI from 'pixi.js';
import { View } from '../../../../framework/view';
import { GsapUtil } from '../../../util/gsap-util';

export class IllustrationView extends View {

  private sprite: PIXI.Sprite

  private renderWidth: number;

  constructor(sprite: PIXI.Sprite) {
    super();

    this.sprite = sprite;
  }

  public init() {
    this.sprite.alpha = 0;
    this.sprite.x = (this.renderWidth - this.sprite.width) / 2;

    this.addChild(this.sprite);
  }

  play(tl: gsap.core.Timeline) {
    GsapUtil.toFadeIn(tl, this.sprite);
  }

  setRenderWidth(width: number) {
    this.renderWidth = width;
  }
}

import { gsap } from 'gsap';
import * as PIXI from 'pixi.js';
import { View } from '../../../../../framework/view';
import { GsapUtil } from '../../../../util/gsap-util';

export class IllustrationView extends View {

  private illustrationSprite: PIXI.Sprite

  private targetWidth: number;

  constructor(sprite: PIXI.Sprite) {
    super();

    this.illustrationSprite = sprite;
  }

  public init() {
    this.illustrationSprite.alpha = 0;
    this.illustrationSprite.x = (this.targetWidth - this.illustrationSprite.width) / 2;

    this.addChild(this.illustrationSprite);
  }

  play(tl: gsap.core.Timeline) {
    GsapUtil.toFadeIn(tl, this.illustrationSprite);
  }

  setTargetWidth(width: number) {
    this.targetWidth = width;
  }
}

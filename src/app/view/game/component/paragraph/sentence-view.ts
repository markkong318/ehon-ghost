import { gsap } from 'gsap';
import * as PIXI from 'pixi.js';
import bottle from '../../../../../framework/bottle';
import { View } from '../../../../../framework/view';
import { BOTTLE_AUDIO_CONTEXT } from '../../../../env/bottle';
import { BookModel } from '../../../../model/book-model';
import { MaskSprite } from '../../../../sprite/mask-sprite';
import { TextStyleBuilder } from '../../../../style/text-style-builder';
import { GsapUtil } from '../../../../util/gsap-util';

export class SentenceView extends View {

  private bookModel: BookModel = bottle.inject(BookModel);
  private readonly text: string;
  private readonly voice: AudioBuffer;
  private audioContext: AudioContext = bottle.inject(BOTTLE_AUDIO_CONTEXT);
  private textSprite: PIXI.Text;
  private maskSprites: PIXI.Sprite[];

  private fontSize: number;
  private targetWidth: number;
  private textMetrics: PIXI.TextMetrics;

  constructor(text: string, voice: AudioBuffer) {
    super();

    this.text = text;
    this.voice = voice;
    this.fontSize = 26;
  }

  public init() {
    const style = TextStyleBuilder.new()
      .setColor(this.bookModel.fontColor)
      .setMultiLine(this.targetWidth)
      .setFontSize(this.fontSize)
      .build();

    this.textSprite = new PIXI.Text(this.text, style);
    this.textMetrics = PIXI.TextMetrics.measureText(this.text, style)

    this.maskSprites = [];
    const maskView = new PIXI.Container();
    for (let i = 0; i < this.textMetrics.lines.length; i++) {
      const maskSprite = new MaskSprite().get();

      maskSprite.x = -MaskSprite.WIDTH;
      maskSprite.y = (this.textSprite.height / this.textMetrics.lines.length - maskSprite.height) / 2 + (this.textSprite.height / this.textMetrics.lines.length) * i;

      this.maskSprites.push(maskSprite);

      maskView.addChild(maskSprite);
    }

    this.addChild(maskView);
    this.textSprite.mask = maskView;

    this.addChild(this.textSprite);
  }

  play(tl: gsap.core.Timeline) {
    const xs: number[] = [];
    for (let i = 0; i < this.maskSprites.length; i++) {
      xs[i] = this.textSprite.x + this.textMetrics.lineWidths[i] - MaskSprite.WIDTH + MaskSprite.GRADIENT_WIDTH;
    }

    GsapUtil.toTextsVoice(tl, this.maskSprites, xs, this.voice.duration, this.voice, this.audioContext);
  }

  setTargetWidth(width: number) {
    this.targetWidth = width;
  }
}

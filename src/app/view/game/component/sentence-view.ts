import {gsap} from 'gsap';
import * as PIXI from 'pixi.js';
import bottle from '../../../../framework/bottle';
import {View} from '../../../../framework/view';
import {BOTTLE_AUDIO_CONTEXT} from '../../../env/bottle';
import {BookModel} from '../../../model/book-model';
import {MaskSprite} from '../../../sprite/mask-sprite';
import { TextStyleBuilder } from '../../../style/text-style-builder';
import {GsapUtil} from '../../../util/gsap-util';

export class SentenceView extends View {

  private bookModel: BookModel = bottle.inject(BookModel);
  private readonly text: string;
  private readonly voice: AudioBuffer;
  private audioContext: AudioContext = bottle.inject(BOTTLE_AUDIO_CONTEXT);
  private textSprite: PIXI.Text;
  private maskSprite: PIXI.Sprite;
  private maskSprites: PIXI.Sprite[];

  private textWidth: number;
  private fontSize: number;
  private renderWidth: number;
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
      .setMultiLine(this.renderWidth)
      .setFontSize(this.fontSize)
      .build();

    this.textSprite = new PIXI.Text(this.text, style);

    this.textMetrics = PIXI.TextMetrics.measureText(this.text, style)
    console.log(this.textMetrics);

    this.maskSprites = [];
    const myMask = new PIXI.Container();
    for (let i = 0; i < this.textMetrics.lines.length; i++) {
      const maskSprite = new MaskSprite().get();

      maskSprite.x = -MaskSprite.WIDTH;
      maskSprite.y = (this.textSprite.height / this.textMetrics.lines.length - maskSprite.height) / 2 + (this.textSprite.height / this.textMetrics.lines.length) * i;

      this.maskSprites.push(maskSprite);

      // this.addChild(maskSprite);
      myMask.addChild(maskSprite);
    }

    this.addChild(myMask);
    this.textSprite.mask = myMask;

    //
    // this.textWidth = this.textSprite.width;
    //
    // this.maskSprite = new MaskSprite().get();
    // this.maskSprite.x = -MaskSprite.WIDTH;
    // this.maskSprite.y = (this.textSprite.height - this.maskSprite.height) / 2;

    // this.textSprite.mask = this.maskSprite;

    // this.addChild(this.maskSprite)
    this.addChild(this.textSprite);
  }

  // public getTextWidth() {
  //   return this.textWidth;
  // }

  play(tl: gsap.core.Timeline) {
    const xs: number[] = [];
    for (let i = 0; i < this.maskSprites.length; i++) {
      xs[i] = this.textSprite.x + this.textMetrics.lineWidths[i] - MaskSprite.WIDTH + MaskSprite.GRADIENT_WIDTH;
    }

    GsapUtil.toTextsVoice(
      tl,
      this.maskSprites,
      xs,
      this.voice.duration,
      this.voice,
      this.audioContext);
  }

  setRenderWidth(width: number) {
    this.renderWidth = width;
  }

}

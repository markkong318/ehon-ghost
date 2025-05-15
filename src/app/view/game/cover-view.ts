import { gsap } from 'gsap';
import * as PIXI from 'pixi.js';
import bottle from '../../../framework/bottle';
import rocket from '../../../framework/rocket';
import { View } from '../../../framework/view';
import { BOTTLE_AUDIO_CONTEXT } from '../../env/bottle';
import { EVENT_NEXT_PAGE } from '../../env/event';
import { BookModel } from '../../model/book-model';
import { TextStyleBuilder } from '../../style/text-style-builder';
import { applyShake } from '../../util/cover-util';
import { GsapUtil } from '../../util/gsap-util';

export class CoverView extends View {

  private bookModel: BookModel = bottle.inject(BookModel);
  private audioContext: AudioContext = bottle.inject(BOTTLE_AUDIO_CONTEXT);
  private titleText: PIXI.Text;
  private nextBtnText: PIXI.Text;

  constructor() {
    super();
  }

  public setAssets(title: string) {

    this.titleText = new PIXI.Text(title,
      TextStyleBuilder.new()
        .setColor(this.bookModel.fontColor)
        .setCustomOptions({ fontSize: 70 })
        .build());
    this.titleText.x = (this.width - this.titleText.width) / 2;
    this.titleText.y = 180;
    this.titleText.alpha = 1;
    this.addChild(this.titleText);

    this.nextBtnText = new PIXI.Text('次へ',
      TextStyleBuilder.new()
        .setColor(this.bookModel.fontColor)
        .build());
    this.nextBtnText.anchor = new PIXI.ObservablePoint(() => {}, () => {}, 0.5, 0.5);
    this.nextBtnText.x = (this.width) / 2;
    this.nextBtnText.y = 420;
    this.nextBtnText.alpha = 1;
    this.nextBtnText.interactive = true;
    this.nextBtnText.on('pointerdown', async () => {
      this.nextBtnText.scale = new PIXI.Point(2, 2);
      rocket.emit(EVENT_NEXT_PAGE)
    });
    this.nextBtnText.on('pointerup', async () => {
      this.nextBtnText.interactive = false;
      this.nextBtnText.scale = new PIXI.Point(1, 1);
    });
    this.addChild(this.nextBtnText);

    const ticker = PIXI.Ticker.shared;
    ticker.add(() => applyShake(this.titleText, 0.7));
  }

  public fadeIn(tl: gsap.core.Timeline) {
    GsapUtil.toFadeIn(tl, this);
  }

  public fadeOut(tl: gsap.core.Timeline) {
    GsapUtil.toFadeOut(tl, this);
  }

  public play(tl: gsap.core.Timeline) {
    GsapUtil.toWait(tl);
    GsapUtil.toVoice(tl, this.bookModel.cover.voice, this.audioContext);
  }
}

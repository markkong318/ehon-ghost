import { gsap } from 'gsap';
import * as PIXI from 'pixi.js';
import bottle from '../../../framework/bottle';
import rocket from '../../../framework/rocket';
import { View } from '../../../framework/view';
import { BOTTLE_AUDIO_CONTEXT } from '../../env/bottle';
import { EVENT_GO_NEXT_PAGE } from '../../env/event';
import { BookModel } from '../../model/book-model';
import { TextStyleBuilder } from '../../style/text-style-builder';
import { AudioUtil } from '../../util/audio-util';
import { applyShake } from '../../util/cover-util';
import { GsapUtil } from '../../util/gsap-util';

export class CoverView extends View {

  private bookModel: BookModel = bottle.inject(BookModel);
  private audioContext: AudioContext = bottle.inject(BOTTLE_AUDIO_CONTEXT);
  private titleText: PIXI.Text;
  private nextBtnText: PIXI.Text;
  private noiseSprite: PIXI.Sprite;
  private ticker: PIXI.Ticker;

  constructor() {
    super();
  }

  public setAssets(title: string) {
    this.ticker = new PIXI.Ticker();
    this.ticker.start();

    const noiseFilter = new PIXI.filters.NoiseFilter();
    noiseFilter.noise = 10;
    noiseFilter.seed = 0.5;

    this.noiseSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.noiseSprite.width = this.size.width;
    this.noiseSprite.height = this.size.height;
    this.noiseSprite.tint = this.bookModel.backgroundColor;
    this.noiseSprite.filters = [noiseFilter];
    this.addChild(this.noiseSprite);

    this.ticker.add(() => { noiseFilter.seed += 0.002; });

    this.titleText = new PIXI.Text(title,
      TextStyleBuilder.new()
        .setColor(this.bookModel.fontColor)
        .setCustomOptions({ fontSize: 70 })
        .build());
    this.titleText.x = this.width - this.titleText.width;
    this.titleText.y = this.height - this.titleText.height;
    this.titleText.alpha = 1;
    this.addChild(this.titleText);

    this.nextBtnText = new PIXI.Text('▼',
      TextStyleBuilder.new()
        .setColor(this.bookModel.fontColor)
        .setFontSize(12)
        .build());
    this.nextBtnText.anchor = new PIXI.ObservablePoint(() => {}, () => {}, 0.5, 0.5);
    this.nextBtnText.x = this.width - this.nextBtnText.width;
    this.nextBtnText.y = this.height - this.nextBtnText.height;
    this.nextBtnText.alpha = 1;
    this.nextBtnText.interactive = true;
    this.nextBtnText.on('pointerdown', async () => {
      this.nextBtnText.scale = new PIXI.Point(2, 2);
      rocket.emit(EVENT_GO_NEXT_PAGE)
    });
    this.nextBtnText.on('pointerup', async () => {
      this.nextBtnText.interactive = false;
      this.nextBtnText.scale = new PIXI.Point(1, 1);
    });
    this.addChild(this.nextBtnText);

    this.ticker.add(() => applyShake(this.titleText, 0.7));
  }

  public fadeIn(tl: gsap.core.Timeline) {
    GsapUtil.toFadeIn(tl, this);
  }

  public fadeOut(tl: gsap.core.Timeline) {
    GsapUtil.toFadeOut(tl, this);
    GsapUtil.toFunction(tl, (ticker) => ticker.stop(), [this.ticker]);
  }

  public play(tl: gsap.core.Timeline) {
    GsapUtil.toWait(tl);
    GsapUtil.toVoice(tl, this.bookModel.cover.voice, this.audioContext);
  }
}

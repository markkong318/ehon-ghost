import {gsap} from 'gsap';
import * as PIXI from 'pixi.js';
import bottle from '../../../framework/bottle';
import rocket from '../../../framework/rocket';
import {View} from '../../../framework/view';
import {BOTTLE_AUDIO_CONTEXT} from '../../env/bottle';
import {EVENT_NEXT_PAGE} from '../../env/event';
import {BookModel} from '../../model/book-model';
import {TextStyle} from '../../style/text-style';
import {GsapUtil} from '../../util/gsap-util';

export class CoverView extends View {

  private bookModel: BookModel = bottle.inject(BookModel);
  private textStyle: TextStyle = bottle.inject(TextStyle);
  private audioContext: AudioContext = bottle.inject(BOTTLE_AUDIO_CONTEXT);
  private title: PIXI.Text;
  private nextBtn: PIXI.Text;

  constructor() {
    super();
  }

  public setAssets(title: string) {

    this.title = new PIXI.Text(title, this.textStyle.getWithColor(this.bookModel.fontColor, {fontSize: 70}));
    this.title.x = (this.width - this.title.width) / 2;
    this.title.y = 180;
    this.title.alpha = 1;
    this.addChild(this.title);

    this.nextBtn = new PIXI.Text('次へ', this.textStyle.getWithColor(this.bookModel.fontColor));
    this.nextBtn.anchor = new PIXI.ObservablePoint(() => {
    }, () => {
    }, 0.5, 0.5);
    this.nextBtn.x = (this.width) / 2;
    this.nextBtn.y = 420;
    this.nextBtn.alpha = 1;
    this.nextBtn.interactive = true;
    this.nextBtn.on('pointerdown', async () => {
      this.nextBtn.scale = new PIXI.Point(2, 2);
      rocket.emit(EVENT_NEXT_PAGE)
    });
    this.nextBtn.on('pointerup', async () => {
      this.nextBtn.interactive = false;
      this.nextBtn.scale = new PIXI.Point(1, 1);
    });
    this.addChild(this.nextBtn);
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

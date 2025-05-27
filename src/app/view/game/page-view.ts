import { gsap } from 'gsap';
import * as PIXI from 'pixi.js';
import bottle from '../../../framework/bottle';
import Rocket from '../../../framework/rocket';
import rocket from '../../../framework/rocket';
import { View } from '../../../framework/view';
import { BOTTLE_AUDIO_CONTEXT } from '../../env/bottle';
import { EVENT_GO_NEXT_PAGE, EVENT_SET_TOUCH_ACTIVE } from '../../env/event';
import { ArticleModel } from '../../model/article-model';
import { BookModel } from '../../model/book-model';
import { TextStyleBuilder } from '../../style/text-style-builder';
import { GsapUtil } from '../../util/gsap-util';
import { ArticleView } from './component/article-view';

export class PageView extends View {

  private bookModel: BookModel = bottle.inject(BookModel);
  private audioContext: AudioContext = bottle.inject(BOTTLE_AUDIO_CONTEXT);
  private articleView: ArticleView;
  private nextBtn: PIXI.Text;

  constructor() {
    super();
  }

  public async init() {

  }

  public fadeInNextBtn(tl: gsap.core.Timeline) {
    GsapUtil.toFadeIn(tl, this.nextBtn);
  }

  public setAssets(articleModel: ArticleModel) {

    if (this.articleView != null) {
      this.removeChild(this.articleView);
    }

    if (this.nextBtn != null) {
      this.removeChild(this.nextBtn);
    }

    this.articleView = new ArticleView(articleModel);
    this.articleView.setTargetWidth(this.width);
    this.articleView.init();
    this.articleView.x = 0;
    this.articleView.y = 50;
    this.addChild(this.articleView);

    this.nextBtn = new PIXI.Text('▼',
      TextStyleBuilder.new()
        .setColor(this.bookModel.fontColor)
        .setFontSize(12)
        .build());
    this.nextBtn.x = this.width - this.nextBtn.width - 50;
    this.nextBtn.y = this.height - this.nextBtn.height - 20;
    this.nextBtn.alpha = 0;
    this.nextBtn.interactive = true;
    this.nextBtn.on('pointerdown', () => rocket.emit(EVENT_GO_NEXT_PAGE));
    this.addChild(this.nextBtn);
  }

  public play(tl: gsap.core.Timeline, isLast: boolean) {
    this.fadeIn(tl);
    this.articleView.play(tl);

    if (!isLast) {
      GsapUtil.toFunction(tl, () => Rocket.emit(EVENT_SET_TOUCH_ACTIVE));
      GsapUtil.toFadeIn(tl, this.nextBtn);
    } else {
      GsapUtil.toWait(tl);
      GsapUtil.toVoice(tl, this.bookModel.endVoice, this.audioContext);
    }
  }

  public fadeIn(tl: gsap.core.Timeline) {
    GsapUtil.toFadeIn(tl, this);
  }

  public fadeOut(tl: gsap.core.Timeline) {
    GsapUtil.toFadeOut(tl, this);
  }
}

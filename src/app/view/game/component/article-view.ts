import {gsap} from 'gsap';
import {View} from '../../../../framework/view';
import {ArticleModel} from '../../../model/article-model';
import {GsapUtil} from '../../../util/gsap-util';
import {SentenceView} from './sentence-view';

export class ArticleView extends View {

  private articleModel: ArticleModel;
  private sentenceViews: SentenceView[] = [];

  private renderWidth: number;

  constructor(articleModel: ArticleModel) {
    super();
    this.articleModel = articleModel;
  }

  public init() {
    super.init();

    const width = this.renderWidth;
    const interval = 10;

    let y = 0;

    for (let i = 0; i < this.articleModel.sentences.length; i++) {
      const view = new SentenceView(this.articleModel.sentences[i].text, this.articleModel.sentences[i].voice);
      view.setRenderWidth(width);
      view.x = 0;
      view.y = y;

      view.init();

      y += view.height + interval;

      this.addChild(view);
      this.sentenceViews.push(view);
    }
  }

  public play(tl: gsap.core.Timeline) {
    for (let i = 0; i < this.articleModel.sentences.length; i++) {
      this.sentenceViews[i].play(tl);
      GsapUtil.toWait(tl);
    }
  }

  // public getMaxTextWidth() {
  //   return Math.max(...this.sentenceViews.map(view => view.getTextWidth()));
  // }

  public setRenderWidth(width: number) {
    this.renderWidth = width;
  }
}

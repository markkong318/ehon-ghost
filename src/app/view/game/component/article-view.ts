import { gsap } from 'gsap';
import { View } from '../../../../framework/view';
import { ArticleModel } from '../../../model/article-model';
import { isIllustration, isSentence } from '../../../util/article-util';
import { GsapUtil } from '../../../util/gsap-util';
import { IllustrationView } from './illustration-view';
import { SentenceView } from './sentence-view';

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
      const sentence = this.articleModel.sentences[i];

      let view;

      if (isSentence(sentence)) {
        view = new SentenceView(sentence.text, sentence.voice);
      } else if (isIllustration(sentence)) {
        view = new IllustrationView(sentence.illustration);
      }

      if (!view) {
        continue;
      }

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

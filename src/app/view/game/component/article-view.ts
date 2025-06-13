import { gsap } from 'gsap';
import { View } from '../../../../framework/view';
import { ArticleModel } from '../../../model/article-model';
import { isIllustration, isSentence } from '../../../util/article-util';
import { GsapUtil } from '../../../util/gsap-util';
import { IllustrationView } from './paragraph/illustration-view';
import { SentenceView } from './paragraph/sentence-view';

export class ArticleView extends View {

  private articleModel: ArticleModel;
  private sentenceViews: SentenceView[] = [];

  private targetWidth: number;
  private padding: number;

  constructor(articleModel: ArticleModel) {
    super();
    this.articleModel = articleModel;
  }

  public init() {
    super.init();

    const width = this.targetWidth;
    const interval = 10;
    const padding = 40;

    let y = 0;

    for (let i = 0; i < this.articleModel.paragraphs.length; i++) {
      const paragraph = this.articleModel.paragraphs[i];

      let view;

      if (isSentence(paragraph)) {
        view = new SentenceView(paragraph.text, paragraph.voice);
      } else if (isIllustration(paragraph)) {
        view = new IllustrationView(paragraph.illustration);
      }

      if (!view) {
        continue;
      }

      view.setTargetWidth(width - padding * 2);
      view.x = padding;
      view.y = y;

      view.init();

      y += view.height + interval;

      this.addChild(view);
      this.sentenceViews.push(view);
    }
  }

  public play(tl: gsap.core.Timeline) {
    for (let i = 0; i < this.sentenceViews.length; i++) {
      this.sentenceViews[i].play(tl);
      GsapUtil.toWait(tl);
    }
  }

  public setTargetWidth(width: number) {
    this.targetWidth = width;
  }
}

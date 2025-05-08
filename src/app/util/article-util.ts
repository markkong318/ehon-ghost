import { ArticleModel } from '../model/article-model';
import { SentenceModel } from '../model/sentence-model';

export function isSentence(model: SentenceModel) {
  return !model.illustration;
}

export function isIllustration(model: SentenceModel) {
  return !!model.illustration;
}

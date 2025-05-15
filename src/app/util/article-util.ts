import { ParagraphModel } from '../model/paragraph-model';

export function isSentence(model: ParagraphModel) {
  return !model.illustration;
}

export function isIllustration(model: ParagraphModel) {
  return !!model.illustration;
}

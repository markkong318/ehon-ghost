import { Model } from '../../framework/model';
import { ParagraphModel } from './paragraph-model';

export class ArticleModel extends Model {
  public paragraphs: ParagraphModel[] = [];
}

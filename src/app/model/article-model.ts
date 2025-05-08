import { Model } from '../../framework/model';
import { SentenceModel } from './sentence-model';

export class ArticleModel extends Model {
  public sentences: SentenceModel[] = [];
}

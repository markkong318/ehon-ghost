import { Model } from '../../framework/model';
import { ArticleModel } from './article-model';

export class PageModel extends Model {
  public article: ArticleModel;
}

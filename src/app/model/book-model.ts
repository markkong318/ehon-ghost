import { Model } from '../../framework/model';
import { CoverModel } from './cover-model';
import { PageModel } from './page-model';

export class BookModel extends Model {
  public cover: CoverModel;
  public pages: PageModel[] = [];
  public backgroundColor: number;
  public fontColor: number;
  public endVoice: AudioBuffer;
}

import { Sprite } from 'pixi.js';
import { Model } from '../../framework/model';

export class ParagraphModel extends Model {
  public text: string;
  public voice: AudioBuffer;
  public illustration: Sprite;
}

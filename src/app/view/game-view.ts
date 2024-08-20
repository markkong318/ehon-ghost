import * as PIXI from 'pixi.js';
import {Background} from '../../framework/background';
import bottle from '../../framework/bottle';
import {Size} from '../../framework/size';

import {View} from '../../framework/view';
import {BookModel} from '../model/book-model';
import {CoverView} from './game/cover-view';
import {PageView} from './game/page-view';
import {TouchSprite} from './game/touch-sprite';

export class GameView extends View {
  private bookModel: BookModel = bottle.inject(BookModel);
  private coverView: CoverView;
  private pageView: PageView;
  private touchSprite: TouchSprite;

  constructor() {
    super();
  }

  public init() {
    this.background = new Background(PIXI.Texture.WHITE, this.bookModel.backgroundColor);

    const height = 700

    this.coverView = bottle.singleton(CoverView);
    this.coverView.size = new Size(this.size.width, height);
    this.coverView.background = new Background(PIXI.Texture.WHITE, this.bookModel.backgroundColor);
    this.coverView.y = (this.size.height - height) / 2;
    this.coverView.init();
    this.addChild(this.coverView);

    this.pageView = bottle.singleton(PageView);
    this.pageView.size = new Size(this.size.width, height);
    this.pageView.background = new Background(PIXI.Texture.WHITE, this.bookModel.backgroundColor);
    this.pageView.y = (this.size.height - height) / 2;
    this.pageView.alpha = 0;
    this.pageView.init();
    this.addChild(this.pageView);

    // this.touchSprite = bottle.singleton(TouchSprite);
    // this.touchSprite.width = this.width;
    // this.touchSprite.height = this.height;
    // this.touchSprite.interactive = true;
    // this.addChild(this.touchSprite);

    // this.touchSprite.setBaseView(this.flickerView);
  }
}

import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import bottle from '../../framework/bottle';
import { Controller } from '../../framework/controller';
import rocket from '../../framework/rocket';
import { EVENT_GO_NEXT_PAGE, EVENT_SET_TOUCH_ACTIVE } from '../env/event';
import { PAGE_NUMBER_COVER, PAGE_NUMBER_INITIAL } from '../env/game';
import { BookModel } from '../model/book-model';
import { CoverView } from '../view/game/cover-view';
import { PageView } from '../view/game/page-view';
import { TouchSprite } from '../view/game/touch-sprite';

export class MainController extends Controller {

  private bookModel: BookModel = bottle.inject(BookModel);
  private coverView: CoverView = bottle.inject(CoverView);
  private pageView: PageView = bottle.inject(PageView);
  private touchSprite: TouchSprite = bottle.inject(TouchSprite);

  private pageIdx: number = 0;
  private tl: gsap.core.Timeline;

  public async main() {
    this.tl = new gsap.core.Timeline();

    await this.initEvent();
    await this.initBook();

    this.goNextPage();
  }

  private async initEvent() {
    rocket.on(EVENT_GO_NEXT_PAGE, async () => {
      this.goNextPage();
    });

    rocket.on(EVENT_SET_TOUCH_ACTIVE, async () => {
      console.log("on EVENT_SET_TOUCH_ACTIVE");
      this.setTouchActive();
    });
  }

  private async initBook() {
    this.pageIdx = PAGE_NUMBER_INITIAL;
  }

  private goNextPage() {
    this.pageIdx++;

    if (this.pageIdx >= this.bookModel.pages.length) {
      return;
    }

    if (this.pageIdx === PAGE_NUMBER_COVER) {
      this.coverView.setAssets(this.bookModel.cover.title);
      this.coverView.fadeIn(this.tl);
      this.touchSprite.setActive(true);
      return;
    }

    this.touchSprite.setActive(false);

    if (this.pageIdx === 0) {
      this.coverView.play(this.tl);
      this.coverView.fadeOut(this.tl)
    } else {
      this.pageView.fadeOut(this.tl);
    }

    // this.pageView.fadeOut(this.tl);
    this.pageView.setAssets(this.bookModel.pages[this.pageIdx].article);
    this.pageView.fadeIn(this.tl);

    this.pageView.play(this.tl, this.pageIdx === this.bookModel.pages.length - 1);
  }

  private setTouchActive() {
    this.touchSprite.setActive(true);
  }
}

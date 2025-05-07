import {Application} from '../framework/application';
import bottle from '../framework/bottle';
import {Size} from '../framework/size';
import {View} from '../framework/view';
import '../vendor/unmute.js';
import {MainController} from './controller/main-controller';
import {ResourceController} from './controller/resource-controller';
import {IllustrationResource} from './storage/illustration-resource';
import {Storage} from './storage/storage';
import {VoiceResource} from './storage/voice-resource';
import {GameView} from './view/game-view';
import {LoadingView} from './view/loading-view';

export class GameApplication extends Application {
  private mainController: MainController;
  private resourceController: ResourceController;
  private loadingView: LoadingView;
  private gameView: GameView;
  private storage: Storage;
  private voiceResource: VoiceResource;
  private illustrateResource: IllustrationResource;

  constructor(options?) {
    super(options);
    this.initLoading();
  }

  public async initLoading() {
    bottle.setObject(this.renderer);

    this.voiceResource = bottle.singleton(VoiceResource);
    this.illustrateResource = bottle.singleton(IllustrationResource);
    this.storage = bottle.singleton(Storage);

    const viewWidth = 480;
    const viewHeight = this.getViewHeight(viewWidth);

    this.loadingView = bottle.singleton(LoadingView);
    this.loadingView.size = new Size(viewWidth, viewHeight);
    this.loadingView.init();

    this.stage.addChild(this.loadingView);

    this.resizeView(this.loadingView);

    this.resourceController = bottle.singleton(ResourceController);
    await this.resourceController.load();

    await this.initScene();
  }

  private async initScene() {
    const viewWidth = 480;
    const viewHeight = this.getViewHeight(viewWidth);

    this.gameView = bottle.singleton(GameView);
    this.gameView.size = new Size(viewWidth, viewHeight);
    this.gameView.init();

    this.stage.addChild(this.gameView);

    this.resizeView(this.gameView);

    this.mainController = bottle.singleton(MainController);

    await this.mainController.main();
  }

  public getViewHeight(viewWidth) {
    if (this.renderer.width > this.renderer.height) {
      return 900;
    } else {
      return Math.floor(viewWidth * this.renderer.height / this.renderer.width);
    }
  }

  public resizeView(view: View): void {
    if (this.renderer.width > this.renderer.height) {
      const scale = Math.min(this.renderer.width / view.size.width, this.renderer.height / view.size.height) / this.renderer.resolution;

      view.scale.x = scale;
      view.scale.y = scale;

      view.x = (this.renderer.width - view.size.width * scale * this.renderer.resolution) / 2 / this.renderer.resolution;
      view.y = (this.renderer.height - view.size.height * scale * this.renderer.resolution) / 2 / this.renderer.resolution;
    } else {
      const scale = this.renderer.width / view.size.width / this.renderer.resolution;

      view.scale.x = scale;
      view.scale.y = scale;

      view.x = 0;
      view.y = (this.renderer.height - view.size.height * scale * this.renderer.resolution) / 2 / this.renderer.resolution;
    }
  }
}

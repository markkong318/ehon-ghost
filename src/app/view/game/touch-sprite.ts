import * as PIXI from 'pixi.js';
import rocket from '../../../framework/rocket';
import { EVENT_NEXT_PAGE } from '../../env/event';

export class TouchSprite extends PIXI.Sprite {
  private isDown: boolean = false;
  private isActive: boolean = false;

  constructor(texture?: PIXI.Texture) {
    super(texture);

    this.interactive = true;
    this.on('pointerdown', () => {
      console.log('Pointer down');

      if (!this.isActive) {
        return;
      }

      this.isDown = true;
    });

    this.on('pointerup', () => {
      console.log('Pointer up');

      if (!this.isActive) {
        return;
      }

      if (!this.isDown) {
        return;
      }

      rocket.emit(EVENT_NEXT_PAGE);

      this.isDown = false;
    });
  }

  public setActive(isActive: boolean) {
    this.isActive = isActive;
  }
}

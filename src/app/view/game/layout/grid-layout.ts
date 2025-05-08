import { View } from '../../../../framework/view';

export class GridLayout {
  private parent: View;

  private sizeX: number;
  private sizeY: number;
  private padding: number;

  private noResize: boolean;

  constructor(parent: View, sizeX: number, sizeY: number, padding: number,
              { noResize }: { noResize: boolean } = { noResize: false }) {
    this.parent = parent;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.padding = padding;

    this.noResize = noResize;
  }

  put(view: any, idxX: number, idxY: number) {

    this.parent.addChild(view)

    const width = (this.parent.width / this.sizeX) - this.padding * 2;
    const height = (this.parent.height / this.sizeY) - this.padding * 2;

    if (!this.noResize) {
      view.width = width;
      view.height = height;
    }

    console.log('vw: ' + view.width)
    console.log('vh: ' + view.height)
    console.log('scale: ' + view.scale)

    console.log('cellWidth: ' + width)
    console.log('cellHeight: ' + height)

    const x =
      this.padding +
      (width + this.padding * 2) * idxX +
      (width - view.width) / 2;
    const y = this.padding +
      (height + this.padding * 2) * idxY +
      (height - view.height) / 2;

    view.x = x;
    view.y = y;
  }

  update(view: any, idxX: number, idxY: number) {
    const width = (this.parent.width / this.sizeX) - this.padding * 2;
    const height = (this.parent.height / this.sizeY) - this.padding * 2;

    if (!this.noResize) {
      view.width = width;
      view.height = height;
    }

    console.log('vw: ' + view.width)
    console.log('vh: ' + view.height)
    console.log('scale: ' + view.scale)

    console.log('cellWidth: ' + width)
    console.log('cellHeight: ' + height)

    const x =
      this.padding +
      (width + this.padding * 2) * idxX +
      (width - view.width) / 2;
    const y = this.padding +
      (height + this.padding * 2) * idxY +
      (height - view.height) / 2;

    view.x = x;
    view.y = y;
  }
}

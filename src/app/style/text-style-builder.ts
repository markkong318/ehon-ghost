import * as PIXI from 'pixi.js';

export class TextStyleBuilder {
  private options: Partial<PIXI.ITextStyle> = {
    dropShadow: true,
    dropShadowAlpha: 0.8,
    dropShadowAngle: 0,
    dropShadowBlur: 5,
    dropShadowDistance: 0,
    fill: ['#ffffff'],
    fillGradientType: 1,
    fillGradientStops: [0],
    lineJoin: 'round',
    miterLimit: 6,
    padding: 10,
    strokeThickness: 4,
    fontFamily: 'corporate-mincho',
    letterSpacing: 0.1,
  };

  public static new(): TextStyleBuilder {
    return new TextStyleBuilder();
  }

  public setColor(color: number): TextStyleBuilder {
    this.options.dropShadowColor = color;
    this.options.stroke = color;
    return this;
  }

  public setMultiLine(width: number): TextStyleBuilder {
    this.options.breakWords = true;
    this.options.wordWrap = true;
    this.options.wordWrapWidth = width;
    return this;
  }

  public setFontSize(size: number): TextStyleBuilder {
    this.options.fontSize = size;
    return this;
  }

  public setCustomOptions(customOptions: Partial<PIXI.ITextStyle>): TextStyleBuilder {
    this.options = { ...this.options, ...customOptions };
    return this;
  }

  public build(): PIXI.TextStyle {
    return new PIXI.TextStyle(this.options);
  }
}

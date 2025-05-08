import * as PIXI from 'pixi.js';
import game from '../../assets/data/game.json';
import illustrations from '../../assets/images/*.png';
import voices from '../../assets/voices/*.wav';
import bottle from '../../framework/bottle';
import { Controller } from '../../framework/controller';
import { BOTTLE_AUDIO_CONTEXT } from '../env/bottle';
import { ArticleModel } from '../model/article-model';
import { BookModel } from '../model/book-model';
import { CoverModel } from '../model/cover-model';
import { PageModel } from '../model/page-model';
import { SentenceModel } from '../model/sentence-model';
import { IllustrationResource } from '../storage/illustration-resource';
import { VoiceResource } from '../storage/voice-resource';

export class ResourceController extends Controller {
  private illustrationResource: any = bottle.inject(IllustrationResource);
  private voiceResource: VoiceResource = bottle.inject(VoiceResource);

  private bookModel: BookModel;

  constructor() {
    super();
  }

  async load() {
    await this.loadVoices();
    await this.loadIllustrations();

    this.initBook();
  }

  private async loadVoices() {
    // @ts-ignore
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    bottle.set(BOTTLE_AUDIO_CONTEXT, audioContext);

    const promises = Object.keys(voices)
      .filter(key => voices.hasOwnProperty(key))
      .map(async key => {
        console.log(key + ' -> ' + voices[key]);

        // @ts-ignore
        const url = new URL(voices[key], import.meta.url);

        const response = await fetch(url.href);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        this.voiceResource.set(key, audioBuffer);
      });

    await Promise.all(promises);
  }

  private async loadIllustrations() {
    for (let key in illustrations) {
      if (illustrations.hasOwnProperty(key)) {
        console.log(key + ' -> ' + illustrations[key]);

        // @ts-ignore
        const url = new URL(illustrations[key], import.meta.url);
        const sprite = PIXI.Sprite.from(url.href);

        this.illustrationResource.set(key, sprite);
      }
    }
  }

  private initBook() {
    this.bookModel = new BookModel();
    this.bookModel.backgroundColor = parseInt(game.book.backgroundColor, 16);
    this.bookModel.fontColor = parseInt(game.book.fontColor, 16);
    this.bookModel.voiceEnd = this.voiceResource.get(game.book.voiceEnd);

    const coverModel = new CoverModel();
    coverModel.title = game.book.cover.title;
    coverModel.voice = this.voiceResource.get(game.book.cover.voice);
    this.bookModel.cover = coverModel;

    for (let i = 0; i < game.book.pages.length; i++) {
      const pageModel = new PageModel();

      const articleModel = new ArticleModel();

      for (let j = 0; j < game.book.pages[i].article.sentences.length; j++) {
        const sentenceModel = new SentenceModel();
        const sentence = game.book.pages[i].article.sentences[j];

        if (sentence.text) {
          sentenceModel.text = game.book.pages[i].article.sentences[j].text;
        }

        if (sentence.voice) {
          sentenceModel.voice = this.voiceResource.get(sentence.voice);
        }

        if (sentence.illustration) {
          sentenceModel.illustration = this.illustrationResource.get(sentence.illustration);
        }

        articleModel.sentences.push(sentenceModel);
      }

      pageModel.article = articleModel;

      this.bookModel.pages.push(pageModel);
    }

    bottle.setObject(this.bookModel);
  }
}

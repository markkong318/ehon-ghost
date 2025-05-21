import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

export interface VoicevoxOptions {
  hostname: string;
  speakerId: number;
  filename: string;
  outputPath: string;
}

export class VoicevoxSynthesizer {
  private hostname: string;
  private speakerId: number;
  private filename: string;
  private outputPath: string;

  constructor(options: VoicevoxOptions) {
    this.hostname = options.hostname;
    this.speakerId = options.speakerId;
    this.filename = options.filename;
    this.outputPath = options.outputPath;
  }

  async synthesize(text: string): Promise<string[]> {
    const texts = text.split('。');
    const generatedFiles: string[] = [];

    for (let i = 0; i < texts.length; i++) {
      const currentText = texts[i];

      if (currentText === '') continue;

      try {
        const audioQueryResponse = await axios.post(
          `http://${this.hostname}:50021/audio_query`,
          null,
          {
            params: { text: currentText, speaker: this.speakerId },
          }
        );

        const synthesisResponse = await axios.post(
          `http://${this.hostname}:50021/synthesis`,
          JSON.stringify(audioQueryResponse.data),
          {
            params: { speaker: this.speakerId },
            headers: {
              'Content-Type': 'application/json',
            },
            responseType: 'arraybuffer',
          }
        );

        const filePath = path.join(
          this.outputPath,
          `${this.filename}_${String(i).padStart(3, '0')}.wav`
        );

        fs.writeFileSync(filePath, Buffer.from(synthesisResponse.data));
        generatedFiles.push(filePath);
        console.log(`Generated: ${filePath}`);

      } catch (error) {
        console.error('Error during synthesis:', error);
        throw error; // Re-throw the error to be handled by the caller
      }
    }

    return generatedFiles;
  }
}

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

// import { VoicevoxSynthesizer, VoicevoxOptions } from './voicevox-synthesizernpx tsx ';

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

  async synthesize(text: string, filename: string): Promise<void> {
    const generatedFiles: string[] = [];

    try {
      const audioQueryResponse = await axios.post(
        `http://${this.hostname}:50021/audio_query`,
        null,
        {
          params: { text, speaker: this.speakerId },
        }
      );

      audioQueryResponse.data.speedScale = 0.7;

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
        `${filename}.wav`
      );

      fs.writeFileSync(filePath, Buffer.from(synthesisResponse.data));
      console.log(`Generated: ${filePath}`);

    } catch (error) {
      console.error('Error during synthesis:', error);
      throw error;
    }
  }
}

interface BookData {
  version: string;
  book: {
    backgroundColor: string;
    fontColor: string;
    cover: {
      title: string;
      voice: string;
    };
    pages: {
      article: {
        paragraphs: ({
          text?: string;
          voice?: string;
          illustration?: string;
        })[];
      };
    }[];
    endVoice: string;
  };
}

async function main() {
  // Get command-line arguments
  const args = process.argv.slice(2); // Remove 'node' and script name

  if (args.length === 0) {
    console.error('Usage: node script.js <jsonFile> [--hostname <hostname>] [--port <port>] [--speaker <speaker>]');
    process.exit(1);
  }

  const jsonFile = args[0];
  let hostname = 'localhost';
  let port = 50021;
  let speaker = 1;

  // Parse optional arguments
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--hostname' && i + 1 < args.length) {
      hostname = args[i + 1];
      i++;
    } else if (args[i] === '--port' && i + 1 < args.length) {
      port = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--speaker' && i + 1 < args.length) {
      speaker = parseInt(args[i + 1], 10);
      i++;
    } else {
      console.error(`Unknown argument: ${args[i]}`);
      process.exit(1);
    }
  }

  try {
    const jsonData: BookData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    const assetsDir = path.join(path.dirname(jsonFile), '..', '..', 'assets', 'voices');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    // Create VoicevoxSynthesizer instance
    const voicevoxOptions: VoicevoxOptions = {
      hostname: hostname,
      speakerId: speaker,
      filename: 'voice', // Base filename, will be overridden in the loop
      outputPath: assetsDir,
    };
    const synthesizer = new VoicevoxSynthesizer(voicevoxOptions);

    // Synthesize cover title
    const coverVoiceFilename = 'voice_0.wav';
    const coverVoicePath = path.join(assetsDir, coverVoiceFilename);
    synthesizer.synthesize(jsonData.book.cover.title, 'voice_0');
    console.log(`Synthesized cover title to ${coverVoicePath}`);

    synthesizer.synthesize('終わり', jsonData.book.endVoice);
    console.log(`Synthesized end to ${coverVoicePath}`);

    // Synthesize page paragraphs
    for (let pageIndex = 0; pageIndex < jsonData.book.pages.length; pageIndex++) {
      const page = jsonData.book.pages[pageIndex];
      const paragraphs = page.article.paragraphs;

      for (let paragraphIndex = 0; paragraphIndex < paragraphs.length; paragraphIndex++) {
        const paragraph = paragraphs[paragraphIndex];

        if (paragraph.text) {
          const voiceFilename = `voice_${pageIndex + 1}_${paragraphIndex + 1}.wav`;
          const voicePath = path.join(assetsDir, voiceFilename);
          const filename = `voice_${pageIndex + 1}_${paragraphIndex + 1}`;//Set filename for current text

          try {
            await synthesizer.synthesize(paragraph.text, filename);
            // fs.renameSync(path.join(assetsDir, `voice_${pageIndex + 1}_${paragraphIndex + 1}_000.wav`), voicePath);

            console.log(`Synthesized page ${pageIndex + 1}, paragraph ${paragraphIndex + 1} to ${voicePath}`);

            // Update JSON data
            paragraph.voice = `voice_${pageIndex + 1}_${paragraphIndex + 1}`;
          } catch (err) {
            console.error("Synthesis Failed:" + err);
          }

        }
      }
    }

    // Write updated JSON back to file
    fs.writeFileSync(jsonFile, JSON.stringify(jsonData, null, 2));
    console.log(`Updated JSON file: ${jsonFile}`);

  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();

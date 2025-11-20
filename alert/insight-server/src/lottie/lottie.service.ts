import { Injectable } from '@nestjs/common';
import LottieCompress from 'lottie-compress';

@Injectable()
export class LottieService {
  constructor() {}

  async compress(fileBuffer: Buffer): Promise<Buffer> {
    if (!fileBuffer) {
      throw new Error('fileBuffer is required');
    }

    try {
      const jsonData = JSON.parse(fileBuffer.toString('utf-8'));
      const lottieCompress = new LottieCompress(jsonData);

      return await lottieCompress.execute();
    } catch (error) {
      console.error(`Error parsing JSON data: ${error.message || 'error'}`);
      throw error;
    }
  }
}

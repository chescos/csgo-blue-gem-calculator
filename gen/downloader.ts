import { writeFile } from 'fs/promises';
import path from 'path';
import { exit } from 'process';

class Downloader {
  total: number;
  urls: string[];
  concurrency: number;
  folder: string;

  constructor(urls: string[], folder: string, concurrency: number) {
    this.total = urls.length;
    this.urls = urls;
    this.folder = folder;
    this.concurrency = concurrency;
  }

  async start(): Promise<void> {
    console.log('Downloading missing images...');

    const promises: Promise<void>[] = [];

    for (let i: number = 0; i < this.concurrency; i++) {
      promises.push(this.spawnWorker());
    }

    let failedAny: boolean = false;
    for (const promise of await Promise.allSettled(promises)) {
      if (promise.status === 'rejected') {
        console.error('Error downloading images:', promise.reason);
        failedAny = true;
      }
    }

    if (failedAny) {
      console.error('Some images failed to download.');
      exit(1);
    }

    console.log('\nAll missing images downloaded');
  }

  async spawnWorker(): Promise<void> {
    let url: string | undefined;

    while ((url = this.urls.shift()) !== undefined) {
      const response: Response = await fetch(url);

      if (!response.ok) {
        this.urls.push(url);

        continue;
      }

      const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
      const buffer: Buffer<ArrayBuffer> = Buffer.from(arrayBuffer);
      const fileName: string = path.basename(new URL(url).pathname);
      await writeFile(path.join(this.folder, '/', fileName), buffer);

      this.updateStatus();
    }
  }

  updateStatus(): void {
    const downloaded = (this.total - this.urls.length).toLocaleString('en-US');
    const total = this.total.toLocaleString('en-US');

    process.stdout.write(`\r${downloaded}/${total} images downloaded`);
  }
}

export default Downloader;

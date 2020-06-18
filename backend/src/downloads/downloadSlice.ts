export class IVideo {
  id: string;
  url: string;
  programme?: string;
  series: number = -1;
  episodeNumber: number = -1;
  episodeTitle?: string;
  filename?: string;
  attempts: number = 0;
  year?: string;
  tagged: boolean = false;
  isFilm: boolean = true;
  downloaded?: boolean = false;
  downloadedAt?: number;

  constructor(url: string) {
    const match = url.match(/episode\/(\w+)\//);
    if (match && match.length > 0) {
      this.id = match[1];
    } else {
      this.id = '<invalid>';
    }
    this.url = url;
  }
}

export type IVideoMap = { [id: string]: IVideo };

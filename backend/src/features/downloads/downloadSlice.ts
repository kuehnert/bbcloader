export class IVideo {
  id: string;
  url: string;
  programme?: string;
  series = -1;
  episodeNumber = -1;
  episodeTitle?: string;
  filename?: string;
  attempts = 0;
  year?: string;
  tagged = false;
  isFilm = true;
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

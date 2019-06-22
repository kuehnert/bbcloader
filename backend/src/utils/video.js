class Video {
  constructor(url) {
    this.url = url;
    this.programme = '';
    this.series = -1;
    this.episodeNumber = -1;
    this.episodeTitle = '';
    this.filename = '';
    this.attempts = 0;
    // this.tagged = false;
    // this.downloaded = false;
    // this.subtitle_converted = false;
    // this.sorted = false;
  }
}

module.exports = Video;

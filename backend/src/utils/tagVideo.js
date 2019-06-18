/* eslint no-param-reassign: ["error", { "props": false }] */
function sentenceCase(str) {
  if (str === null || str === '') return false;
  return str
    .toString()
    .replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

function dd(number) {
  if (number < 10) {
    return `0${number}`;
  }

  return number;
}

const tagVideo = (video) => {
  if (video.tagged) {
    return false;
  }

  const { url } = video;
  const match = url.match(/\/([\w-]+)-series-(\d+)-(\d+)-(.+)$/);

  if (match) {
    // Match /(killing-eve)-series-(2)-(7)-(wide-awake)
    [, video.programme, video.series, video.episodeNumber, video.episodeTitle] = match;
    video.tagged = true;
  }

  const match2 = url.match(/\/([\w-]+)-series-(\d+)-episode-(\d+)/);

  if (match2) {
    // Match /(21-again)-series-(1)-episode-(4)
    [, video.programme, video.series, video.episodeNumber] = match2;
    video.episodeTitle = `Episode ${video.episodeNumber}`;
    video.tagged = true;
  }

  if (video.tagged) {
    video.programme = sentenceCase(video.programme.replace(/-/g, ' '));
    video.episodeTitle = sentenceCase(video.episodeTitle.replace(/-/g, ' '));
    video.filename = `${video.programme} S${dd(video.series)}E${dd(video.episodeNumber)} ${
      video.episodeTitle
    }`;
  }

  return video;
};

module.exports = tagVideo;

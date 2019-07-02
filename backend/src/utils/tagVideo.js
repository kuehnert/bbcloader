const parser = require('fast-html-parser');
const axios = require('axios');

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

async function getYearForFilm(url) {
  try {
    console.log(`trying to find year for ${url}`);

    const response = await axios.get(url);
    const root = parser.parse(response.data);

    const dateInfo = root.querySelector('.episode-metadata').childNodes[1].childNodes[1].rawText;
    const year = dateInfo.match(/\d{4}/)[0];
    console.log('tagVideo year: ', url, year);
    return year;
  } catch (error) {
    console.error('tagVideo year not found for', url);
    return -1;
  }
}

const tagVideo = async (videoParam, cb) => {
  if (videoParam.tagged) {
    return null;
  }

  const video = JSON.parse(JSON.stringify(videoParam));
  const { url } = video;
  const match = url.match(/episode\/(\w+)\/([\w-]+)-series-(\d+)-(\d+)-(.+)$/);

  if (match) {
    // Match /(killing-eve)-series-(2)-(7)-(wide-awake)
    [, video.id, video.programme, video.series, video.episodeNumber, video.episodeTitle] = match;
    video.tagged = true;
  }

  const match2 = url.match(/episode\/(\w+)\/([\w-]+)-series-(\d+)-episode-(\d+)/);
  if (match2) {
    // Match /(21-again)-series-(1)-episode-(4)
    [, video.id, video.programme, video.series, video.episodeNumber] = match2;
    video.episodeTitle = `Episode ${video.episodeNumber}`;
    video.tagged = true;
  }

  if (video.tagged) {
    video.programme = sentenceCase(video.programme.replace(/-/g, ' '));
    video.episodeTitle = sentenceCase(video.episodeTitle.replace(/-/g, ' '));
    video.filename = `${video.programme} S${dd(video.series)}E${dd(video.episodeNumber)} ${
      video.episodeTitle
    }`;

    if (cb) cb(video);
    return video;
  }

  const match3 = url.match(/episode\/(\w+)\/([^/]+)$/);
  if (match3) {
    // Match films: /iplayer/episode/b0078rmt/lucky-jim
    [, video.id, video.programme] = match3;
    video.programme = sentenceCase(video.programme.replace(/-/g, ' '));

    const year = await getYearForFilm(url);

    if (year) {
      video.year = year;
      if (year > -1) {
        video.programme = `${video.programme} (${video.year})`;
      }
    }
    video.filename = video.programme;

    if (cb) cb(video);
    return video;
  }

  return null;
};

module.exports = tagVideo;

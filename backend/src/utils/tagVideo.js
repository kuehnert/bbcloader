/* eslint no-param-reassign: ["error", { "props": true,
"ignorePropertyModificationsFor": ["video"] }] */
const parser = require('fast-html-parser');
const request = require('request');

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

function getYearForFilm(url) {
  const response = request.get({ url });
  console.log('tagVideo response.body: ', response.body);
  const root = parser.parse(response.body);
  const dateInfo = root.querySelector('.episode-metadata').childNodes[1].childNodes[1].rawText;
  const year = dateInfo.match(/\d{4}/)[0];
  console.log('tagVideo year: ', year);
  return year;

  // return axios.get(url).then((response) => {
  //   const root = parser.parse(response.data);
  //   const dateInfo = root.querySelector('.episode-metadata').childNodes[1].childNodes[1].rawText;
  //   const year = dateInfo.match(/\d{4}/)[0];
  //   return year;
  // });
}

const tagVideo = (video) => {
  if (video.tagged) {
    return false;
  }

  console.log('tagging video:', video.url);
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

    return video;
  }

  const match3 = url.match(/\/([^/]+)$/);
  if (match3) {
    // Match films: /iplayer/episode/b0078rmt/lucky-jim
    video.programme = sentenceCase(match3[1].replace(/-/g, ' '));

    // const year = getYearForFilm(url);
    const year = null;
    if (year) {
      video.year = year;
      video.programme = `${video.programme} (${video.year})`;
      video.tagged = true;
    } else {
      video.tagged = false;
    }
    video.filename = video.programme;
    // console.log('tagVideo video: ', video);
    return video;
  }

  return null;
};

module.exports = tagVideo;

const parser = require('fast-html-parser');
const axios = require('axios');
const Download = require('../models/download');

function sentenceCase(str) {
  if (str == null || str === '') return false;
  return str.toString().replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

function dd(n) {
  if (n < 10) {
    return `0${n}`;
  }

  return n;
}

async function getYearForFilm(url) {
  try {
    const response = await axios.get(url);
    const root = parser.parse(response.data);

    const dateInfo = root.querySelector('.episode-metadata').childNodes[1].childNodes[1].rawText;
    if (dateInfo == null) {
      return null;
    }

    const match = dateInfo.match(/\d{4}/);
    const year = match && match[0];
    // console.log('tagdownload year: ', url, year);
    return year;
  } catch (error) {
    // console.error('tagdownload year not found for', url);
    return null;
  }
}

const createDownload = async (url) => {
  const nextOrderIndex = await Download.lastIndex();
  const download = new Download({ url, addedAt: new Date(), orderIndex: nextOrderIndex });
  const match = url.match(/episode\/(\w+)\/([\w-]+)-series-(\d+)-(\d+)-(.+)$/);
  const match2 = url.match(/episode\/(\w+)\/([\w-]+)-series-(\d+)-episode-(\d+)/);
  const match3 = url.match(/episode\/(\w+)\/([^/]+)-episode-(\d)$/);

  if (match) {
    // Match /(killing-eve)-series-(2)-(7)-(wide-awake)
    [, download.bbcID, download.programme, download.series, download.episodeNumber, download.episodeTitle] = match;
    download.tagged = true;
  } else if (match2) {
    // Match /(21-again)-series-(1)-episode-(4)
    [, download.bbcID, download.programme, download.series, download.episodeNumber] = match2;
    download.episodeTitle = `Episode ${download.episodeNumber}`;
    download.tagged = true;
  } else if (match3) {
    // Match films: /iplayer/episode/b06whymr/war-and-peace-episode-2
    [, download.bbcID, download.programme, download.episodeNumber] = match3;
    download.series = 1;
    download.episodeTitle = `Episode ${download.episodeNumber}`;
    download.tagged = true;
  }

  if (download.tagged) {
    download.programme = sentenceCase(download.programme.replace(/-/g, ' '));
    download.episodeNumber = +download.episodeNumber;
    download.episodeTitle = sentenceCase(download.episodeTitle.replace(/-/g, ' '));
    download.filename = `${download.programme} S${dd(download.series)}E${dd(download.episodeNumber)} ${download.episodeTitle}`;
    download.isFilm = false;
    download.year = await getYearForFilm(url);

    try {
      await download.save();
      return { download };
    } catch (error) {
      return { error };
    }
  }

  const match4 = url.match(/episode\/(\w+)\/([^/]+)$/);
  if (match4) {
    // Match films: /iplayer/episode/b0078rmt/lucky-jim
    [, download.bbcID, download.programme] = match4;
    download.programme = sentenceCase(download.programme.replace(/-/g, ' '));
    download.isFilm = true;
    const year = await getYearForFilm(url);

    if (year) {
      download.year = year;
      if (year > -1) {
        download.programme = `${download.programme} (${download.year})`;
      }
    }

    download.filename = download.programme;
    try {
      await download.save();
      return { download };
    } catch (error) {
      return { error };
    }
  }

  return null;
};

module.exports = createDownload;

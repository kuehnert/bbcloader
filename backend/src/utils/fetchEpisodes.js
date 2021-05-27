// const request = require('request');
const fetch = require('node-fetch');
const _ = require('lodash');

// Find episodes in series URL, like:
// /iplayer/episode/m00062r1/thatcher-a-very-british-revolution-series-1-5-downfall
const fetchEpisodes = async url => {
  try {
    const res = await fetch(url);
    const html = await res.text();
    let links = html.match(/\/iplayer\/episode\/[^"]+/g);
    links = _.uniq(links.sort());
    links = links.map(link => `https://www.bbc.co.uk${link}`);
    return links;
  } catch (error) {
    console.log('error', error);
    return [];

  }
};

module.exports = fetchEpisodes;

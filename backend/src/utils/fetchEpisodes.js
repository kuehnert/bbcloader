const fetch = require('node-fetch');
const _ = require('lodash');
const debug = require('./debug');

// Find episodes in series URL, like:
// /iplayer/episode/m00062r1/thatcher-a-very-british-revolution-series-1-5-downfall
const fetchEpisodes = async url => {
  try {
    debug(`fetchEpisodes(${url})`);
    const res = await fetch(url);
    const html = await res.text();

    // Check is current episode is included in links. If so, return only current episode
    if (html.includes(">This episode<")) {
      debug("only adding episode, not series");
      return [url.replace(/\?seriesId=\w+$/, '')];
    } else {
      // find out which series is selected and remove "advertised" episode
      const advertised = html.match(/\/iplayer\/episode\/\w+\/ad\/[^"]+/g);
      const advertisedID = advertised ? advertised[0].match(/episode\/(\w+)\/ad/)[1] : null;
      // debug(advertisedID);

      let links = html.match(/\/iplayer\/episode\/[^"]+/g);
      links = links.filter(l => !l.includes(advertisedID)).map(link => `https://www.bbc.co.uk${link.replace(/\?seriesId=\w+$/, '')}`);
      links = _.uniq(links.sort());
      // debug(links);
      return links;
    }

  } catch (error) {
    console.error('error', error);
    return [];
  }
};

module.exports = fetchEpisodes;

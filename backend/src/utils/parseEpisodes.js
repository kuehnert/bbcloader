const request = require('request');
const _ = require('lodash');

// /iplayer/episode/m00062r1/thatcher-a-very-british-revolution-series-1-5-downfall
const parseEpisodes = (url, callback) => {
  request.get({ url }, (error, { body }) => {
    if (error) {
      callback([]);
    }

    let links = body.match(/\/iplayer\/episode\/[^"]+/g);
    links = _.uniq(links.sort());
    links = links.map(link => `https://www.bbc.co.uk${link}`);
    callback(links);
  });
};

module.exports = parseEpisodes;

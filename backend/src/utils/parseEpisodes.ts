import request from 'request';
import _ from 'lodash';

// Find episodes in series URL, like:
// /iplayer/episode/m00062r1/thatcher-a-very-british-revolution-series-1-5-downfall
export const parseEpisodes = (url: string, callback: (urls: string[]) => void): void => {
  request.get({ url }, (error, { body }) => {
    if (error) {
      callback([]);
    }

    let links = body.match(/\/iplayer\/episode\/[^"]+/g);
    links = _.uniq(links.sort());
    links = links.map((link: string) => `https://www.bbc.co.uk${link}`);
    callback(links);
  });
};

const fs = require('fs-extra');
const _ = require('lodash');

function getEnv() {
  return _.pick(
    process.env,
    'NODE_ENV',
    'DOWNLOAD_DIR',
    'DESTINATION_TV',
    'DESTINATION_MOVIES'
  );
}

function shareAvailable() {
  const { DOWNLOAD_DIR, DESTINATION_MOVIES, DESTINATION_TV } = process.env;
  return fs.existsSync(DOWNLOAD_DIR) && fs.existsSync(DESTINATION_MOVIES) && fs.existsSync(DESTINATION_TV);
}

module.exports = { shareAvailable, getEnv };

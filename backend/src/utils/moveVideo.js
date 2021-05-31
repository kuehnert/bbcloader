const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');

function shareAvailable(share) {
  return fs.existsSync(share);
}

const moveVideo = (sourceDir, destination, filename, ext) => {
  if (!fs.existsSync(destination)) {
    console.log(`Creating folder '${destination}'`);
    fs.mkdirSync(destination, { recursive: true });
  }

  const fromFile = path.join(sourceDir, `${filename}.${ext}`);
  const toFile = path.join(destination, `${filename}.${ext}`);

  fs.moveSync(fromFile, toFile);
};

module.exports = moveVideo;

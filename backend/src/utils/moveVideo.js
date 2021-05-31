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

  try {
    fs.moveSync(fromFile, toFile);
    console.log('Moved file successfully', toFile);
  } catch (error) {
    console.error("Error moving file", error);
  }
};

module.exports = moveVideo;

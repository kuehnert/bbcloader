const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');

function shareAvailable(share) {
  return fs.existsSync(share);
}

const moveVideo = async (sourceDir, destination, filename, ext) => {
  if (!fs.existsSync(destination)) {
    console.log(`Creating folder '${destination}'`);
    fs.mkdirSync(destination, { recursive: true });
  }

  const fromFile = path.join(sourceDir, `${filename}.${ext}`);
  const toFile = path.join(destination, `${filename}.${ext}`);

  try {
    await fs.copy(fromFile, toFile);
    console.log('Copied file successfully', toFile);
  } catch (error) {
    return console.error("Error copying file", error);
  }

  try {
    await fs.remove(fromFile);
    console.log('Removed source file successfully', fromFile);
  } catch (error) {
    return console.error("Error removing file", error);
  }
};

module.exports = moveVideo;

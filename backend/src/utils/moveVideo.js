const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

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
    // await fs.copy(fromFile, toFile);
    const { stdout, stderr } = await exec(`cp "${fromFile}" "${toFile}" `)
    console.log('stdout', JSON.stringify(stdout, null, 4));
    console.log('stderr', JSON.stringify(stderr, null, 4));

    console.log('Copied file successfully', toFile);
  } catch (error) {
    console.error("Error copying file", error);
    return error;
  }

  try {
    await fs.remove(fromFile);
    console.log('Removed source file successfully', fromFile);
  } catch (error) {
    console.error("Error removing file", error);
    return error;
  }
};

module.exports = moveVideo;

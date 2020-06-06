const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const videosFilename = path.join(__dirname, '..', '..', 'data', 'videos.json');
const completedFilename = path.join(__dirname, '..', '..', 'data', 'videosDone.json');

function shareAvailable(share) {
  return fs.existsSync(share);
}

const saveVideos = (videos, completed) => {
  fs.writeFileSync(videosFilename, JSON.stringify(videos));
  if (completed) {
    fs.writeFileSync(completedFilename, JSON.stringify(completed));
  }
};

const loadVideos = () => {
  try {
    const buffer = fs.readFileSync(videosFilename);
    return JSON.parse(buffer.toString());
  } catch (error) {
    return {};
  }
};

const loadCompleted = () => {
  try {
    const buffer = fs.readFileSync(completedFilename);
    let completed = JSON.parse(buffer.toString());
    completed = _.filter(completed, (v) => v.id != null);
    completed = _.uniqBy(completed, "id");
    return completed;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const moveVideo = (sourceDir, destination, filename, ext) => {
  if (!fs.existsSync(destination)) {
    console.log(`Creating folder '${destination}'`);
    fs.mkdirSync(destination, { recursive: true });
  }

  const fromFile = path.join(sourceDir, `${filename}.${ext}`);
  const toFile = path.join(destination, `${filename}.${ext}`);

  fs.renameSync(fromFile, toFile);
};

module.exports = {
  loadCompleted,
  loadVideos,
  saveVideos,
  moveVideo,
  shareAvailable,
};

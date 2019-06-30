const fs = require('fs');
const path = require('path');

const tagVideo = require('./tagVideo');
const Video = require('./video');

const configFilename = path.join(__dirname, '..', '..', 'data', 'config.json');
const videosFilename = path.join(__dirname, '..', '..', 'data', 'videos.json');
const completedFilename = path.join(__dirname, '..', '..', 'data', 'videosDone.json');
// const logFilename = path.join(__dirname, '..', '..', 'data', 'bbcloader.log');

const saveVideos = (videos, completed) => {
  fs.writeFileSync(videosFilename, JSON.stringify(videos));
  if (completed) {
    fs.writeFileSync(completedFilename, JSON.stringify(completed));
  }
};

const loadConfig = () => {
  try {
    const buffer = fs.readFileSync(configFilename);
    return JSON.parse(buffer.toString());
  } catch (error) {
    const config = {
      destinationDir: '/mnt/d/MKData/Videos/Incoming/TVShows',
      downloadCommand: '/mnt/c/ProgramData/chocolatey/bin/youtube-dl.exe',
      downloadDir: 'D:/MKData/Videos/Incoming',
      port: 5000,
    };
    fs.writeFileSync(configFilename, JSON.stringify(config));
    return config;
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
    return JSON.parse(buffer.toString());
  } catch (error) {
    return [];
  }
};

const createVideo = async (videos, url) => {
  const video = new Video(url);
  const existing = videos.find(v => v.url === url);

  if (existing) {
    return false;
  }

  await tagVideo(video);
  videos.push(video);
  saveVideos(videos);
  console.log(`${url} added`);
  return true;
};

const moveVideo = (sourceDir, destinationDir, filename, ext) => {
  if (!fs.existsSync(destinationDir)) {
    console.log(`Creating folder '${destinationDir}'`);
    fs.mkdirSync(destinationDir, { recursive: true });
  }

  const fromFile = path.join(sourceDir, `${filename}.${ext}`);
  const toFile = path.join(destinationDir, `${filename}.${ext}`);

  fs.renameSync(fromFile, toFile);
};

module.exports = {
  loadConfig,
  loadCompleted,
  loadVideos,
  saveVideos,
  createVideo,
  moveVideo,
};

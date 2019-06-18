const fs = require('fs');
const path = require('path');

const tagVideo = require('./tagVideo');
const Video = require('./video');

const configFilename = path.join(__dirname, '..', '..', 'data', 'config.json');
const videosFilename = path.join(__dirname, '..', '..', 'data', 'videos.json');

const loadConfig = () => {
  try {
    const buffer = fs.readFileSync(configFilename);
    return JSON.parse(buffer.toString());
  } catch (error) {
    const config = {
      downloadCommand: '/mnt/c/ProgramData/chocolatey/bin/youtube-dl.exe',
      downloadDir: 'D:/MKData/Videos/Incoming',
      port: 5000,
      targetDir: '/mnt/d/MKData/Videos/Incoming/TVShows',
    };
    fs.writeFileSync(configFilename, JSON.stringify(config));
    return config;
  }
};

const loadVideos = () => {
  try {
    const buffer = fs.readFileSync(videosFilename);
    const videos = JSON.parse(buffer.toString());
    return videos;
  } catch (error) {
    return [];
  }
};

const saveVideos = (videos) => {
  const data = JSON.stringify(videos);
  fs.writeFileSync(videosFilename, data);
};

const createVideo = (url) => {
  const videos = loadVideos();
  const video = new Video(url);

  const existing = videos.find(v => v.url === url);

  if (existing) {
    return false;
  }

  tagVideo(video);
  videos.push(video);
  saveVideos(videos);
  return true;
};

const moveVideo = (sourceDir, destinationDir, filename) => {
  console.log(`Creating folder '${destinationDir}'`);
  fs.mkdir(destinationDir, { recursive: true }, (err) => {
    if (err) throw err;

    console.log(`Renaming file ${filename}`);
    fs.renameSync(path.join(sourceDir, filename), path.join(destinationDir, filename));
  });
};

module.exports = {
  loadConfig,
  loadVideos,
  saveVideos,
  createVideo,
  moveVideo,
};

const fs = require('fs');
const path = require('path');

const configFilename = path.join(__dirname, '..', '..', 'data', 'config.json');
const videosFilename = path.join(__dirname, '..', '..', 'data', 'videos.json');
const completedFilename = path.join(__dirname, '..', '..', 'data', 'videosDone.json');
// const logFilename = path.join(__dirname, '..', '..', 'data', 'bbcloader.log');

function shareAvailable(share) {
  return fs.existsSync(share);
}

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
      destinationTV: '/mnt/d/MKData/Videos/Incoming/TVShows',
      destinationMovies: '/mnt/d/MKData/Videos/Movies/Incoming',
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
  loadConfig,
  loadCompleted,
  loadVideos,
  saveVideos,
  moveVideo,
  shareAvailable,
};

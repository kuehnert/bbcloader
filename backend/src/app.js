const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const file = require('./utils/file');
const parseEpisodes = require('./utils/parseEpisodes');
const startDownload = require('./utils/startDownload');
const getExternalIP = require('./utils/getExternalIP');
const tagVideo = require('./utils/tagVideo');

const app = express();
const MY_IP = '37.24.163.194';
const config = file.loadConfig();
const completed = file.loadCompleted();
let videos = file.loadVideos();
let currentVideo = null;
let externalIP = null;
let lastIPCheck = null;

function isOnline() {
  return externalIP && externalIP !== MY_IP;
}

const updateExternalIP = (ip) => {
  externalIP = ip;
  lastIPCheck = new Date();
  console.log('Got an IP:', externalIP, lastIPCheck);
};

// Something in the video changed, save it
const updateVideo = (video) => {
  if (!videos[video.url] || videos[video.url] !== video) {
    // Video has changed
    videos[video.url] = video;
    file.saveVideos(videos);
  }
};

// Callback for when download finishes (or aborts)
const downloadFinished = ({ video, error }) => {
  currentVideo = false;
  console.log('downloadFinished:', JSON.stringify(video));

  if (!error) {
    // Remove video
    videos = videos.filter(v => v !== video);
    completed.unshift(video);
  }

  file.saveVideos(videos, completed);
};

// Start download
const startNextDownload = async () => {
  // 1. get external IP
  if (!isOnline()) {
    console.log('Not online. Skipping. :(');
    return;
  }

  if (!currentVideo) {
    console.log('Looking for downloads');
    // const download = videos.find(v => v.tagged && !v.downloaded && v.attempts < 5);
    const download = null;

    if (!download) {
      console.log('No download in list');
      currentVideo = false;
    } else {
      console.log('Download found, starting...');
      currentVideo = true;
      download.attempts += 1;
      startDownload(config, download, downloadFinished);
    }
  } else {
    console.log('Download is currentVideo');
  }
};

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/status', (req, res) => {
  res.send({ currentVideo, externalIP, isOnline: isOnline() });
});

app.get('/videos', (req, res) => {
  res.send(Object.values(videos));
});

app.get('/completed', (req, res) => {
  res.send(completed);
});

app.post('/videos', async (req, res) => {
  try {
    const { url } = req.body;

    if (url.match(/\/episodes\//)) {
      // Programme page
      parseEpisodes(url, async (urls) => {
        console.log(urls);
        res.send(urls);

        urls.forEach(async (u) => {
          await file.createVideo(videos, u);
        });

        // Start download
        startNextDownload();
      });
    } else {
      // Individual video
      console.log(`Adding url ${url}...`);
      const video = await file.createVideo(videos, url);

      if (video) {
        res.send(`video url added: ${url}!`);
        startNextDownload();
      } else {
        res.send('Error: Video already in queue');
      }
    }
  } catch (error) {
    console.error(error);
  }
});

app.listen(config.port, '0.0.0.0', () => {
  console.log(`Server is up on port ${config.port}`);
});

console.log('video queue: ', Object.keys(videos).length);
console.log('previously downloaded videos: ', completed.length);

getExternalIP(updateExternalIP);
Object.values(videos).forEach((video) => {
  if (!video.tagged) {
    tagVideo(video, updateVideo);
  }
});

// Start background checks
// startNextDownload();
// setInterval(() => {
//   startNextDownload();
// }, 10 * 60 * 1000); // Every 10 minutes

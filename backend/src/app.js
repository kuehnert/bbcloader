const _ = require('lodash');
const { fork } = require('child_process');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');

const file = require('./utils/file');
const { START_DOWNLOAD, DOWNLOAD_SUCCESSFUL, DOWNLOAD_ERROR } = require('./messages');
const parseEpisodes = require('./utils/parseEpisodes');
const getExternalIP = require('./utils/getExternalIP');
const tagVideo = require('./utils/tagVideo');
const Video = require('./utils/video');
// const startDownload = require('./utils/startDownload');

const app = express();
const MY_IP = '37.24.163.194';
const DOWNLOAD_INTERVAL = 60 * 1000 * (process.env.NODE_ENV === 'production' ? 10 : 1);
const config = file.loadConfig();
const completed = file.loadCompleted();
let forked = null;
let videos = file.loadVideos();
let currentVideo = null;
let externalIP = null;
let lastUpdate = null;
let shareAvailable = null;

function isOnline() {
  return process.env.NODE_ENV === 'development' || (externalIP && externalIP !== MY_IP);
}

// Start download
const startNextDownload = async () => {
  // check if Share is shareAvailable
  if (!shareAvailable) {
    console.error('Share not mounted. Skipping downloads. :(');
    return;
  }

  // Check if VPN connected
  if (!isOnline()) {
    console.error('Not online. Skipping downloads. :(');
    return;
  }

  if (!currentVideo) {
    currentVideo = Object.values(videos).find(v => v.tagged && v.attempts < 5);

    if (!currentVideo) {
      console.log('No download in list');
    } else {
      console.log(`Starting download ${currentVideo.url}...`);
      currentVideo.attempts += 1;

      forked = fork('./src/utils/downloadVideo.js');
      forked.send({ messageType: START_DOWNLOAD, config, video: currentVideo });

      forked.on('message', ({ messageType, error, video }) => {
        if (messageType === DOWNLOAD_SUCCESSFUL) {
          forked.kill();
          videos = _.omit(videos, video.id);
          completed.unshift(video);
          file.saveVideos(videos, completed);
          currentVideo = null;
          startNextDownload();
        } else if (messageType === DOWNLOAD_ERROR) {
          forked.kill();
          console.error(`Error downloading ${video.url}: ${error}`);
          videos[video.id] = video;
          file.saveVideos(videos);
          currentVideo = null;
        }
      });
    }
  } else {
    console.log('Download in progress. Skipping.');
  }
};

const updateExternalIP = (ip) => {
  lastUpdate = new Date();
  externalIP = ip;
  shareAvailable = file.shareAvailable(config.downloadDir);
  console.log(
    'updateExternalIP:',
    externalIP,
    ',',
    isOnline() ? 'VPN connected,' : 'VPN not connected,',
    shareAvailable ? 'share mounted,' : 'share not mounted,',
    lastUpdate,
  );

  startNextDownload();
};

// Something in the video changed, save it
// const updateVideo = (video) => {
//   if (!videos[video.url] || videos[video.url] !== video) {
//     // Video has changed
//     videos[video.id] = video;
//     file.saveVideos(videos);
//   }
// };

// A single video is added to the list
const createVideo = async (url) => {
  let video = new Video(url);
  video = await tagVideo(video);

  if (!videos[video.id]) {
    videos[video.id] = video;
    file.saveVideos(videos);
    console.log(`${video.url} added`);
    return video;
  }

  console.log(`${video.url} NOT added because it is already in list`);
  return null;
};

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/status', (req, res) => {
  console.log('GET /status');

  res.send({
    currentVideo,
    externalIP,
    isOnline: isOnline(),
    lastUpdate,
  });
});

app.get('/videos', (req, res) => {
  console.log('GET /videos');
  res.send(Object.values(videos));
});

app.get('/videos/:id', (req, res) => {
  const { id } = req.params;
  const video = videos[id];
  console.log('GET /videos/', id);

  res.send(video);
});

app.patch('/videos/:id', (req, res) => {
  const { id } = req.params;
  const newVideo = { ...videos[id], ...req.body, id };

  console.log('PATCH /videos/', id);
  videos[id] = newVideo;
  file.saveVideos(videos);

  res.send(newVideo);
});

app.delete('/videos/:id', (req, res) => {
  const { id } = req.params;
  videos = _.omit(videos, id);
  file.saveVideos(videos);

  res.send(id);
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
        const promises = [];

        urls.forEach((u) => {
          promises.push(createVideo(u));
        });

        Promise.all(promises)
          .then((data) => {
            const newVideos = data.filter(v => v !== null);
            res.send(newVideos);
            startNextDownload();
          })
          .catch(err => console.error(err));
      });
    } else {
      // Individual video
      console.log(`Adding url ${url}...`);
      const video = await createVideo(url);

      if (video) {
        res.send(video);
        startNextDownload();
      } else {
        res.send({ error: 'Error: Video already in queue' });
      }
    }
  } catch (error) {
    console.error(error);
  }
});

app.listen(config.port, '0.0.0.0', () => {
  console.log(`Server is up on port ${config.port} with env ${process.env.NODE_ENV}`);
});

console.log('video queue: ', Object.keys(videos).length);
console.log('previously downloaded videos: ', completed.length);

// Start background checks
getExternalIP(updateExternalIP);
setInterval(() => {
  getExternalIP(updateExternalIP);
}, DOWNLOAD_INTERVAL);

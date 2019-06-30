const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const file = require('./utils/file');
const parseEpisodes = require('./utils/parseEpisodes');
const startDownload = require('./utils/startDownload');

const app = express();
const config = file.loadConfig();
const completed = file.loadCompleted();
let videos = file.loadVideos();
let busy = false;

console.log('videos in queue: ', videos.length);
console.log('previously downloaded videos: ', completed.length);

const downloadFinished = ({ video, error }) => {
  busy = false;
  console.log('downloadFinished:', JSON.stringify(video));

  if (!error) {
    // Remove video
    videos = videos.filter(v => v !== video);
    completed.unshift(video);
  }

  file.saveVideos(videos, completed);
};

// Start download
const startNextDownload = () => {
  if (!busy) {
    console.log('Looking for downloads');
    const download = videos.find(v => v.tagged && !v.downloaded && v.attempts < 5);
    if (!download) {
      console.log('No download in list');
      busy = false;
    } else {
      console.log('Download found, starting...');
      busy = true;
      download.attempts += 1;
      startDownload(config, download, downloadFinished);
    }
  } else {
    console.log('Download is busy');
  }
};

startNextDownload();
setInterval(() => {
  startNextDownload();
}, 5 * 60 * 1000); // Every 5 minutes

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/videos', (req, res) => {
  res.send(videos);
});

app.get('/completed', (req, res) => {
  res.send(completed);
});

app.post('/videos', (req, res) => {
  const { url } = req.body;

  if (url.match(/\/episodes\//)) {
    // Programme page
    parseEpisodes(url, (urls) => {
      console.log(urls);
      res.send(urls);

      urls.forEach((u) => {
        await file.createVideo(videos, u);
      });

      // Start download
      startNextDownload();
    });
  } else {
    // Individual video
    console.log(`Adding url ${url}...`);
    const video = file.createVideo(videos, url);

    if (video) {
      res.send(`video url added: ${url}!`);
      startNextDownload();
    } else {
      res.send('Error: Video already in queue');
    }
  }
});

app.listen(config.port, '0.0.0.0', () => {
  console.log(`Server is up on port ${config.port}`);
});

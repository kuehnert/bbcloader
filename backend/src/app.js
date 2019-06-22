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

const downloadFinished = (video) => {
  console.log('downloadFinished:', JSON.stringify(video));
  busy = false;

  // Remove video
  videos = videos.filter(v => v !== video);
  completed.unshift(video);
  file.saveVideos(videos, completed);
};

// Start download
const startInitialDownload = () => {
  console.log('Looking for downloads');
  const download = videos.find(v => v.tagged && !v.downloaded);
  if (!download) {
    console.log('No download in list');
  } else {
    console.log('Download found, starting...');
    busy = true;
    startDownload(config, download, downloadFinished);
  }
};

startInitialDownload();

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
        file.createVideo(videos, u);
      });

      if (!busy) {
        // Start download
        const download = videos.find(v => v.tagged && !v.downloaded);
        if (download) {
          busy = true;
          console.log(`Trying to dl ${download}`);
          startDownload(config, download, downloadFinished);
        } else {
          console.log('No dl');
        }
      }
    });
  } else {
    // Individual video
    console.log(`Adding url ${url}...`);
    const video = file.createVideo(videos, url);

    if (video) {
      res.send(`video url added: ${url}!`);

      if (!busy && video.tagged) {
        // Start download
        startDownload(config, video, downloadFinished);
      }
    } else {
      res.send('Error: Video already in queue');
    }
  }
});

app.listen(config.port, '0.0.0.0', () => {
  console.log(`Server is up on port ${config.port}`);
});

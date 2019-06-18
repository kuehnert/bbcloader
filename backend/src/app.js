const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const file = require('./utils/file');
// const downloadVideo = require('./utils/downloadVideo');

const app = express();
const videos = file.loadVideos();
const config = file.loadConfig();
const processes = [];

// const saveVideos = () => {
//   file.saveVideos(videos);
// };

// const videoDownload = videos.find(v => v.tagged && v.downloaded === false);
// if (videoDownload) {
//   downloadVideo(config, videoDownload, saveVideos);
// }

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/videos', (req, res) => {
  res.send({ processes, videos });
});

app.post('/videos', (req, res) => {
  const { url } = req.body;

  if (file.createVideo(url)) {
    res.send(`video url added: ${url}!`);
  } else {
    res.send('Error: Video already in queue');
  }
});

app.listen(config.port, () => {
  console.log(`Server is up on port ${config.port}`);
});

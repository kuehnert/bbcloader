require('dotenv').config();

import _ from 'lodash';
import { fork } from 'child_process';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import * as file from './utils/file';

import { START_DOWNLOAD, DOWNLOAD_SUCCESSFUL, DOWNLOAD_ERROR } from './messages';

import { parseEpisodes } from './utils/parseEpisodes';
import getExternalIP from './utils/getExternalIP';
import tagVideo from './utils/tagVideo';
import { IVideo, IVideoMap } from './downloads/downloadSlice';

const app = express();
const MY_IP = '37.24.163.194';
const DOWNLOAD_INTERVAL = 60 * 1000 * (process.env.NODE_ENV === 'production' ? 10 : 1);
const completed: IVideo[] = file.loadCompleted();
let forked: any = null;
let videos: IVideoMap = file.loadVideos();
let currentVideo: IVideo | undefined;
let externalIP: string | null = null;
let lastUpdate: Date | null = null;
let shareAvailable: boolean = false;

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

  if (currentVideo == null) {
    currentVideo = Object.values(videos).find((v) => v.tagged && v.attempts < 5);

    if (currentVideo == null) {
      console.log('No download in list');
    } else {
      console.log(`Starting download ${currentVideo.url}...`);
      currentVideo.attempts += 1;

      forked = fork('./src/utils/downloadVideo.js');
      forked.send({ messageType: START_DOWNLOAD, video: currentVideo });

      forked.on('message', ({ messageType, error, video }: { messageType: any; error: any; video: IVideo }) => {
        if (messageType === DOWNLOAD_SUCCESSFUL) {
          forked.kill();
          videos = _.omit(videos, video.id);
          completed.unshift(video);
          file.saveVideos(videos, completed);
          currentVideo = undefined;
          startNextDownload();
        } else if (messageType === DOWNLOAD_ERROR) {
          forked.kill();
          console.error(`Error downloading ${video.url}: ${error}`);
          videos[video.id] = video;
          file.saveVideos(videos);
          currentVideo = undefined;
        }
      });
    }
  } else {
    console.log('Download in progress. Skipping.');
  }
};

const updateExternalIP = (ip: string) => {
  lastUpdate = new Date();
  externalIP = ip;
  shareAvailable = file.shareAvailable(process.env.DOWNLOAD_DIR!);
  console.log(
    'updateExternalIP:',
    externalIP,
    isOnline() ? 'VPN connected,' : 'VPN not connected,',
    shareAvailable ? 'share mounted,' : 'share not mounted,',
    lastUpdate,
  );

  startNextDownload();
};

// Something in the video changed, save it
// const updateVideo = (video) => {
//   if (!videos[video.url] || videos[video.url] !== video) {
//     // IVideo has changed
//     videos[video.id] = video;
//     file.saveVideos(videos);
//   }
// };

// A single video is added to the list
const createVideo = async (url: string) => {
  let video = new IVideo(url);
  video = await tagVideo(video);

  if (completed.find((v) => v.id === video.id) != null) {
    const msg = `${video.filename} NOT added because it has been downloaded already.`;
    console.log(msg);
    return msg;
  } else if (videos[video.id] != null) {
    const msg = `${video.filename} NOT added because it is already on download list`;
    console.log(msg);
    return msg;
  } else {
    videos[video.id] = video;
    file.saveVideos(videos);
    console.log(`${video.url} added`);
    return video;
  }
};

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/status', async (req: express.Request, res: express.Response) => {
  console.log('GET /status');
  await getExternalIP(updateExternalIP);

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

app.get('/finished', (req, res) => {
  console.log('GET /finished');
  res.send(Object.values(completed));
});

app.get('/videos/:id', (req, res) => {
  const { id } = req.params;
  const video = videos[id];
  console.log('GET /videos/', id);

  if (video) {
    res.send(video);
  } else {
    res.status(404).send({ error: 'IVideo not found' });
  }
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
      parseEpisodes(url, async (urls: string[]) => {
        const promises = Array<any>();

        urls.forEach((u) => {
          promises.push(createVideo(u));
        });

        Promise.all(promises)
          .then((data) => {
            const newVideos = data.filter((v) => v !== null);
            res.send(newVideos);
            startNextDownload();
          })
          .catch((err) => console.error(err));
      });
    } else {
      // Individual video
      console.log(`Adding url ${url}...`);
      const video = await createVideo(url);

      if (typeof video === 'string') {
        res.status(409).send({ error: video });
      } else {
        res.send(video);
        startNextDownload();
      }
    }
  } catch (error) {
    console.error(error);
  }
});

app.listen(+(process.env.PORT || 5000), '0.0.0.0', () => {
  console.log(`Server is up on port ${process.env.PORT} with env ${process.env.NODE_ENV}`);
});

console.log('video queue: ', Object.keys(videos).length);
console.log('previously downloaded videos: ', completed.length);

// Start background checks
getExternalIP(updateExternalIP);
setInterval(() => {
  getExternalIP(updateExternalIP);
}, DOWNLOAD_INTERVAL);

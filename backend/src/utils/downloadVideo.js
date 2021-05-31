const fs = require('fs-extra');
const { execFileSync } = require('child_process');
const path = require('path');
const moveVideo = require('./moveVideo');
const { START_DOWNLOAD, DOWNLOAD_SUCCESSFUL, DOWNLOAD_ERROR } = require('./messages');
const ttml2ass = require('./ttml2ass');
const Download = require('../models/download');

process.on('message', async ({ messageType, video: video }) => {
  if (messageType !== START_DOWNLOAD) {
    console.error('Invalid command:', messageType);
    return;
  }

  // const video = JSON.parse(JSON.stringify(inputVideo));
  const args = [
    '--quiet',
    '--sub-lang',
    'en',
    '--write-sub',
    '--output',
    `${process.env.DOWNLOAD_DIR}/${video.filename}.mp4`,
    video.url,
  ];

  try {
    console.log(`Download started with command: ${process.env.YOUTUBE_DL_BIN} ${args.join(' ')}`);
    execFileSync(process.env.YOUTUBE_DL_BIN, args);
  } catch (error) {
    console.error('Download stopped with error!');
    console.log(error.status); // Might be 127 in your example.
    console.log(error.message); // Holds the message you typically want.
    console.log(error.stderr); // Holds the stderr output. Use `.toString()`.
    console.log(error.stdout); // Holds the stdout output. Use `.toString()`.
    process.send({ messageType: DOWNLOAD_ERROR, video: video, error: error });
    return;
  }

  // Move downloads into right folder
  video.downloaded = true;
  video.downloadedAt = new Date().getTime();

  const finalDestination = path.join(
    video.isFilm ? process.env.DESTINATION_MOVIES : process.env.DESTINATION_TV,
    video.programme,
  );
  console.log('Moving file...');
  moveVideo(process.env.DOWNLOAD_DIR, finalDestination, video.filename, 'mp4');

  // Convert & move subtitle file
  const subFile = path.join(process.env.DOWNLOAD_DIR, `${video.filename}.en.ttml`);
  const convertedSubFile = path.join(process.env.DOWNLOAD_DIR, `${video.filename}.en.ass`);
  if (process.env.NODE_ENV === 'development') {
    fs.copyFileSync(path.join(__dirname, '..', '..', 'data', 'demo.en.ttml'), subFile);
  }

  if (fs.existsSync(subFile)) {
    console.log('Converting TTML to ASS');
    const ttml = fs.readFileSync(subFile).toString();
    const ass = ttml2ass(ttml, video.filename);
    fs.writeFileSync(convertedSubFile, ass);
    await moveVideo(process.env.DOWNLOAD_DIR, finalDestination, video.filename, 'en.ttml');
    await moveVideo(process.env.DOWNLOAD_DIR, finalDestination, video.filename, 'en.ass');
  }

  console.log(`DOWNLOADED ${video.url} -> ${path.join(finalDestination, video.filename)}`);
  process.send({ messageType: DOWNLOAD_SUCCESSFUL, video });
});

// Links to async requests:
// https://github.com/ar-comlog/syncrequest
// https://stackoverflow.com/questions/8775262/synchronous-requests-in-node-js
// http://www.acuriousanimal.com/2018/02/15/express-async-middleware.html
// https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016

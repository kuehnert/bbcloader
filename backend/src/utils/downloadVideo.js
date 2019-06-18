/* eslint no-param-reassign: ["error", { "props": false }] */
const { spawn } = require('child_process');
const path = require('path');
const file = require('./file');

const downloadVideo = ({
  downloadDir, downloadCommand, destinationDir,
}, video, callback) => {
  video.downloading = true;
  const url = 'https://www.youtube.com/watch?v=H3t6ZXW63c0';
  console.log(`Video download ${video.url} started.`);

  const downloadProcess = spawn(downloadCommand, [
    '--quiet',
    '--sub-lang',
    'en',
    '--write-sub',
    '--output',
    `${downloadDir}/${video.filename}.mp4`,
    url,
  ]);

  downloadProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  downloadProcess.on('error', (err) => {
    console.log(`Failed to start download process for ${video.url}, error ${err}`);
  });

  downloadProcess.on('close', (code) => {
    console.log(`Video download ${video.url} finished with code ${code}`);

    if (code === 0) {
      // All was fine
      video.downloading = undefined;
      video.downloaded = true;
      console.log(downloadDir, destinationDir, video.filename);
      const finalDestination = path.join(destinationDir, video.programme);
      const fn = `${video.filename}.mp4`;
      file.moveVideo(downloadDir, finalDestination, fn);
      callback();
    }
  });

  return downloadProcess;
};

module.exports = downloadVideo;

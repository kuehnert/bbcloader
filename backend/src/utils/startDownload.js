const { fork } = require('child_process');
const Download = require('../models/download');
const path = require('path');
const { START_DOWNLOAD, DOWNLOAD_SUCCESSFUL, DOWNLOAD_ERROR } = require('./messages');
const _ = require('lodash');
const { shareAvailable } = require('./shareAvailable');

// Start download
const startDownload = async () => {
  // check if share is shareAvailable
  if (!shareAvailable()) {
    return console.error('Share not mounted. Skipping downloads.');
  }

  if (currentDownload == null) {
    currentDownload = await Download.findNextDownload();

    if (currentDownload == null) {
      console.log('No download in list');
    } else {
      console.log(`Starting download ${currentDownload.url}...`);
      currentDownload.attempts += 1;

      forked = fork(path.join(__dirname, 'downloadVideo'));
      forked.send({ messageType: START_DOWNLOAD, video: currentDownload });

      forked.on(
        'message',
        async ({ messageType, error, video }) => {
          if (messageType === DOWNLOAD_SUCCESSFUL) {
            try {
              await Download.findOneAndUpdate({ bbcID: video.bbcID }, video, { new: true, runValidators: true, useFindAndModify: false });
            } catch (error) {
              console.error(error);
            }

            forked.kill();
            currentDownload = null;
            startDownload();
          } else if (messageType === DOWNLOAD_ERROR) {
            forked.kill();
            console.error(`Error downloading ${video.url}: ${error}`);
            currentDownload = null;
          }
        }
      );
    }
  } else {
    console.log('Download in progress. Skipping.');
  }
};

module.exports = startDownload;

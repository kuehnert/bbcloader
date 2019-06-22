const { fork } = require('child_process');

function startDownload(config, video, callback) {
  console.log('startDownload');
  const forked = fork('./src/utils/downloadVideo.js');
  video.attempts += 1;
  forked.send({ config, video });

  forked.on('message', (result) => {
    if (result.error) {
      console.log(`Error downloading ${video.url}.`);
    }

    forked.kill();
    callback({ video, error: result.error });
  });
}

module.exports = startDownload;

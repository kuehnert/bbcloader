const { fork } = require('child_process');

function startDownload(config, video, callback) {
  console.log('startDownload');
  const forked = fork('./src/utils/downloadVideo.js');
  forked.send({ config, video });

  forked.on('message', (result) => {
    console.log('Download of video finished.');
    forked.kill();
    callback(video);
  });
}

module.exports = startDownload;

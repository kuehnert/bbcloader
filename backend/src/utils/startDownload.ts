import { fork } from 'child_process';
import { IVideo } from 'src/downloads/downloadSlice';

export function startDownload(config: any, video: IVideo, callback: ({ video: IVideo, error: Error }) => void) {
  console.log('startDownload');
  const forked = fork('./src/utils/downloadVideo.js');
  forked.send({ msgTyp: 'startDownload', config, video });

  forked.on('message', (message) => {
    if (message) {
      console.log(`Error downloading ${video.url}. message: '${message}'`);
    }

    forked.kill();
    callback({ video, error: message });
  });
}

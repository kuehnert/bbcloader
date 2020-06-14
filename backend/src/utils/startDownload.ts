import { fork, Serializable } from 'child_process';
import { IVideo } from 'src/downloads/downloadSlice';

class ErrorObject {
  error?: any;
}

interface cbParams {
  video: IVideo;
  error: string;
}

export function startDownload(config: any, video: IVideo, callback: ({ video, error }: cbParams) => void) {
  console.log('startDownload');
  const forked = fork('./src/utils/downloadVideo.js');
  forked.send({ msgTyp: 'startDownload', config, video });

  forked.on('message', (message) => {
    const { error } = message as ErrorObject;
    if (error) {
      console.log(`Error downloading ${video.url}. message: '${error}'`);
    }

    forked.kill();
    callback({ video, error });
  });
}

import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import { IVideo, IVideoMap } from '../features/downloads/downloadSlice';

const videosFilename = path.join(__dirname, '..', '..', 'data', 'videos.json');
const completedFilename = path.join(__dirname, '..', '..', 'data', 'videosDone.json');

export function shareAvailable(share: string) {
  return fs.existsSync(share);
}

export const saveVideos = (videos: IVideoMap, completed?: IVideo[]) => {
  fs.writeFileSync(videosFilename, JSON.stringify(videos));
  if (completed) {
    fs.writeFileSync(completedFilename, JSON.stringify(completed));
  }
};

export const loadVideos = () => {
  try {
    const buffer = fs.readFileSync(videosFilename);
    return JSON.parse(buffer.toString());
  } catch (error) {
    return {};
  }
};

export const loadCompleted = () => {
  try {
    const buffer = fs.readFileSync(completedFilename);
    let completed = JSON.parse(buffer.toString());
    completed = _.filter(completed, (v) => v.id != null);
    completed = _.uniqBy(completed, "id");
    return completed;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const moveVideo = (sourceDir: string, destination: string, filename: string, ext: string) => {
  if (!fs.existsSync(destination)) {
    console.log(`Creating folder '${destination}'`);
    fs.mkdirSync(destination, { recursive: true });
  }

  const fromFile = path.join(sourceDir, `${filename}.${ext}`);
  const toFile = path.join(destination, `${filename}.${ext}`);

  fs.renameSync(fromFile, toFile);
};

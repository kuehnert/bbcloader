import React from 'react';
import Status from '../features/status/Status';
import AddVideo from '../features/videos/AddVideo';
import VideoList from '../features/videos/VideoList';
import FinishedList from '../features/videos/FinishedList';
import FavLinks from '../features/favourites/FavLinks';
import styles from './VideosPage.module.scss';

export default function VideosPage() {
  return (
    <div className={styles.page}>
      <h1>
        <img src="/media/BBCWorldService512.png" alt="Logo" width="64" height="64" /> BBC-Downloader
      </h1>

      <h2>Status</h2>
      <Status />

      <h2>Favourites</h2>
      <FavLinks />

      <h2>Add a download</h2>
      <AddVideo />

      <h2>Download list</h2>
      <VideoList />

      <h2>Finished downloads</h2>
      <FinishedList />
    </div>
  );
}

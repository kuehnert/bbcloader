import React from 'react';
import Status from '../status/Status';
import AddVideo from './AddVideo';
import VideoList from './VideoList';
import FavLinks from '../favourites/FavLinks';
import styles from './VideoIndex.module.scss';

export default function VideosPage() {
  return (
    <div className={styles.page}>
      <h2>Status</h2>
      <Status />

      <h2>Favourites</h2>
      <FavLinks />

      <h2>Add a download</h2>
      <AddVideo />

      <h2>Download list</h2>
      <VideoList />
    </div>
  );
}

import React from 'react';
import Status from '../status/Status';
import AddDownload from './AddDownload';
import DownloadList from './DownloadList';
import FavLinks from '../favourites/FavLinks';
import styles from './DownloadIndex.module.scss';
import DebugCard from 'components/DebugCard';

export default function DownloadsPage() {
  return (
    <div className={styles.page}>
      <h2>Status</h2>
      <Status />

      <h2>Favourites</h2>
      <FavLinks />

      <h2>Add a download</h2>
      <AddDownload />

      <h2>Download list</h2>
      <DownloadList />

      <DebugCard />
    </div>
  );
}

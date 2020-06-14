import React from 'react';
import styles from '../videos/VideoIndex.module.scss';
import FinishedList from './FinishedList';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

export default function VideosPage() {
  const { finished } = useSelector((state: RootState) => state.videos);

  return (
    <div className={styles.page}>
      <h2>{finished.length} Finished downloads</h2>

      <FinishedList />
    </div>
  );
}

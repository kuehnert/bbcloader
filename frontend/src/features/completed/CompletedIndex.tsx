import React from 'react';
import styles from '../downloads/DownloadIndex.module.scss';
import FinishedList from './FinishedList';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export default function DownloadsPage(): JSX.Element {
  const { finished } = useSelector((state: RootState) => state.downloads);

  return (
    <div className={styles.page}>
      <h2>{finished.length} Finished downloads</h2>

      <FinishedList />
    </div>
  );
}

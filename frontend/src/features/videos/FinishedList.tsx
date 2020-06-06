import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import styles from './VideoList.module.scss';
import { fetchFinished, Video } from './videoSlice';
import { formatEpisodeNumber } from 'utils/helpers';
import TableButton from 'components/TableButton';

const VideoList: React.FC = () => {
  const dispatch = useDispatch();
  const { finished } = useSelector((state: RootState) => state.videos);

  useEffect(() => {
    dispatch(fetchFinished());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const episodeColumn = (video: Video) => {
    if (video.isFilm) {
      return null;
    } else if (video.series < 0) {
      return '?';
    } else {
      return formatEpisodeNumber(video);
    }
  };

  const actionColumn = (video: Video) => {
    return (
      <>
        <TableButton icon="pencil" to={`/downloads/${video.id}/edit`} />
      </>
    );
  };

  if (finished.length === 0) {
    return <Card className={styles.novideos}>Currently, there are no videos in the download queue.</Card>;
  } else {
    return (
      <DataTable value={finished} autoLayout={true} paginator={true} rows={20}>
        <Column field="id" header="ID" />
        <Column field="programme" header="Programme" />
        <Column field="year" header="Year" />
        <Column header="Episode" body={episodeColumn} />
        <Column field="attempts" header="Attempts" />
        <Column header="Actions" body={actionColumn} />
      </DataTable>
    );
  }
};

export default VideoList;

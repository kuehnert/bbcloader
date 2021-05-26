import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate, formatEpisodeNumber } from 'utils/helpers';
import { RootState } from 'store';
import styles from '../videos/VideoList.module.scss';
import { fetchFinished, Video } from '../videos/videoSlice';

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

  // const actionColumn = (video: Video) => {
  //   return (
  //     <>
  //       <TableButton icon="pencil" to={`/downloads/${video.id}/edit`} />
  //     </>
  //   );
  // };

  const dateFormat = window.innerWidth < 800 ? 'dd-MM' : 'dd-MM-yy';

  const downloadedAtColumn = (video: Video) => {
    return video.downloadedAt ? formatDate(video.downloadedAt, dateFormat) : '';
  };

  if (finished.length === 0) {
    return <Card className={styles.novideos}>Currently, there are no videos in the download queue.</Card>;
  } else {
    return (
      <DataTable value={finished} autoLayout={true} paginator={true} rows={30}>
        {/* <Column field="id" header="ID" /> */}
        <Column field="programme" header="Programme" filter={true} filterMatchMode="contains" sortable={true} />
        <Column header="Episode" body={episodeColumn} />
        {window.innerWidth > 800 && <Column field="year" header="Year" sortable={true} />}
        {window.innerWidth > 800 && <Column field="attempts" header="Attempts" sortable={true} />}
        <Column field="downloadedAt" header="Datum" body={downloadedAtColumn} sortable={true} />
        {/* <Column header="Actions" body={actionColumn} /> */}
      </DataTable>
    );
  }
};

export default VideoList;

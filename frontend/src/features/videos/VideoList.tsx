import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import styles from './VideoList.module.scss';
import { fetchDownloads, Video, deleteVideo } from './videoSlice';
import { formatEpisodeNumber } from 'utils/helpers';
import TableButton from 'components/TableButton';
import TableDeleteButton from 'components/TableDeleteButton';

const VideoList: React.FC = () => {
  const dispatch = useDispatch();
  const videos = useSelector((state: RootState) => state.videos.downloads);

  useEffect(() => {
    dispatch(fetchDownloads());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (id: string) => {
    dispatch(deleteVideo(id));
  };

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
        <TableDeleteButton icon="delete" objectName={video.programme} objectId={video.id} handleDelete={handleDelete} />
      </>
    );
  };

  if (videos.length === 0) {
    return <Card className={styles.novideos}>Currently, there are no videos in the download queue.</Card>;
  } else {
    return (
      <DataTable value={videos} autoLayout={true}>
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

// const mapStateToProps = state => ({
//   videos: Object.values(state.videos),
// });

// export default connect(
//   mapStateToProps,
//   { getVideos }
// )(withStyles(styles)(VideoList));

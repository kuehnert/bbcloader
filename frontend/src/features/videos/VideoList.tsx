import { Card } from 'primereact/card';
import React from 'react';
// import Video from './Video.tsx.bk';
import styles from './VideoList.module.scss';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';

const VideoList: React.FC = () => {
  const videos  = useSelector((state: RootState) => state.videos.downloads);

  if (videos.length === 0) {
    return <Card className={styles.novideos}>Currently, there are no videos in the download queue.</Card>;
  } else {
    // const videoRows = videos.map((video) => {
    //   return <Video video={video} key={video.id} />;
    // });

    return <div className={styles.paper}>Here be videos.</div>;
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

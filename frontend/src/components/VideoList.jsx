import React from 'react';
import Video from './Video';

const VideoList = ({ videos }) => {
  if (videos.length === 0) {
    return <div>Currently, there are no videos in the download queue.</div>;
  } else {
    const videoRows = videos.map(video => {
      return <Video video={video} key={video.url} />;
    });

    return (
      <div className="VideoList">
        <table className="ui striped table">
          <thead>
            <tr>
              <th>Programme</th>
              <th>Series</th>
              <th>Episode</th>
              <th>Title</th>
              <th>Tagged?</th>
              <th>Attempts</th>
            </tr>
          </thead>
          <tbody>{videoRows}</tbody>
          <tfoot>
            <tr>
              <th colSpan={6}><b>{videos.length}</b> Videos on download list</th>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
};

export default VideoList;

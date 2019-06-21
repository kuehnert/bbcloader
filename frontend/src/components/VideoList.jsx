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
      <div>
        <table>
          <thead>
            <tr>
              <th>Programme</th>
              <th>Series</th>
              <th>Episode</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>{videoRows}</tbody>
        </table>
      </div>
    );
  }
};

export default VideoList;

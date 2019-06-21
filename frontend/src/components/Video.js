import * as React from 'react';

const Video = ({video: { programme, series, episodeNumber, episodeTitle }}) => {
  return (
    <tr>
      <td>{programme}</td>
      <td>{series}</td>
      <td>{episodeNumber}</td>
      <td>{episodeTitle}</td>
    </tr>
  );
};

export default Video;

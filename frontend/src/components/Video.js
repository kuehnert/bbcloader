import * as React from 'react';
import './Video.css';

const Video = ({ video: { url, programme, series, episodeNumber, episodeTitle, tagged } }) => {
  if (programme && series >= 0) {
    return (
      <tr>
        <td>
          <a href={url}>{programme}</a>
        </td>
        <td className="right">{series}</td>
        <td className="right">{episodeNumber}</td>
        <td>{episodeTitle}</td>
        <td>{tagged ? '✔' : '❌'}</td>
      </tr>
    );
  } else if (programme) {
    return (
      <tr>
        <td colSpan={4}>
          <a href={url}>{programme}</a>
        </td>
        <td>{tagged ? '✔' : '❌'}</td>
      </tr>
    );
  } else {
    return (
      <tr>
        <td colSpan={5}>
          <a href={url}>{url}</a>
        </td>
      </tr>
    );
  }
};

export default Video;

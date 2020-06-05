import React, { useState } from 'react';
import { string } from 'yup';
import classnames from 'classnames';
import './AddVideo.scss';

interface Props {
  createVideo: () => void;
}

const schema = string().url();

const AddVideo: React.FC = () => {
  const messages: { [key: string]: string } = {
    default: 'Drag & drop URL here',
    enter: 'Drop here!',
    success: 'Video(s) added.',
    error: 'URL not usuable',
  };

  const [dropState, setDropState] = useState('default');

  const onDragOver = (event: React.MouseEvent) => {
    // Prevent brwoser from opening dropped link
    event.preventDefault();
  };

  const onDragEnter = () => {
    setDropState('enter');
  };

  const onDragLeave = () => {
    setDropState('default');
  };

  const onDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    const url = event.dataTransfer.getData('text');

    if (schema.isValid(url) && url.match(/bbc\.co\.uk/)) {
      // createVideo(url);
      setDropState('success');
    } else {
      setDropState('error');
    }

    setTimeout(() => {
      setDropState('default');
    }, 2000);
  };

  return (
    <div
      className={classnames('dropzone', dropState)}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {messages[dropState]}
    </div>
  );
};

export default AddVideo;

import React, { useState } from 'react';
import { string } from 'yup';
import classnames from 'classnames';
import './AddDownload.scss';
import { createDownload } from './downloadSlice';
import { useDispatch } from 'react-redux';

// interface Props {
//   createDownload: () => void;
// }

const schema = string().url();

const AddDownload: React.FC = () => {
  const dispatch = useDispatch();

  const messages: { [key: string]: string } = {
    default: 'Drag & drop URL here',
    enter: 'Drop here!',
    success: 'Download(s) added.',
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
      dispatch(createDownload(url));
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
      onDrop={onDrop}>
      {messages[dropState]}
    </div>
  );
};

export default AddDownload;

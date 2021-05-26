import myhistory from 'myhistory';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { RootState } from 'store';
import VideoForm from './VideoForm';
import { Video, updateVideo } from './videoSlice';

interface MatchParams {
  id: string;
}

const EditVideo: React.FC<RouteComponentProps<MatchParams>> = (props) => {
  const { id } = props.match.params;
  const videos = useSelector((state: RootState) => state.videos.downloads);
  const video = videos.find((v) => v.id === id);
  const dispatch = useDispatch();

  const handleSubmit = (values: Video) => {
    if (values.id) {
      dispatch(updateVideo(values));
      myhistory.push('/');
    }
  };

  if (video == null) {
    myhistory.push('/');
    return null;
  }

  return (
    <div className="p-grid p-justify-center">
      <div className="p-col-8">
        <h1>Edit Video: {video.programme}</h1>
        <VideoForm video={video} handleSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default EditVideo;

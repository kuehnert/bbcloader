import myhistory from 'myhistory';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { RootState } from 'store';
import DownloadForm from './DownloadForm';
import { Download, updateDownload } from './downloadSlice';

interface MatchParams {
  id: string;
}

const EditDownload: React.FC<RouteComponentProps<MatchParams>> = (props) => {
  const { id } = props.match.params;
  const downloads = useSelector((state: RootState) => state.downloads.downloads);
  const download = downloads.find((v) => v.id === id);
  const dispatch = useDispatch();

  const handleSubmit = (values: Download) => {
    if (values.id) {
      dispatch(updateDownload(values));
      myhistory.push('/');
    }
  };

  if (download == null) {
    myhistory.push('/');
    return null;
  }

  return (
    <div className="p-grid p-justify-center">
      <div className="p-col-8">
        <h1>Edit Download: {download.programme}</h1>
        <DownloadForm download={download} handleSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default EditDownload;

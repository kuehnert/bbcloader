import myhistory from 'myhistory';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { RootState } from 'store';
import DownloadForm from './DownloadForm';
import { Download, updateDownload } from './downloadSlice';

interface MatchParams {
  bbcID: string;
}

const EditDownload: React.FC<RouteComponentProps<MatchParams>> = props => {
  const { bbcID } = props.match.params;
  const dispatch = useDispatch();
  const downloads = useSelector(
    (state: RootState) => state.downloads.downloads
  );
  const download = downloads.find(v => v.bbcID === bbcID);

  useEffect(() => {
    if (downloads.length === 0) {
      myhistory.push('/');
    }
  }, [downloads]);

  const handleSubmit = (values: Download) => {
    if (values.bbcID) {
      dispatch(updateDownload(values));
      myhistory.push('/');
    }
  };

  if (download == null) {
    return <div>Loading...</div>;
  }

  return (
    <div className='p-grid p-justify-center'>
      <div className='p-col-8'>
        <h1>Edit Download: {download.programme}</h1>
        <DownloadForm download={download} handleSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default EditDownload;

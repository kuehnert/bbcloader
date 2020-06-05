import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate } from 'utils/helpers';
import { RootState } from '../../store';
import { fetchStatus } from './statusSlice';
import StatusCard from './StatusCard';

const Status: React.FC = () => {
  const dispatch = useDispatch();
  const { externalIP, isOnline, currentVideo, lastUpdate } = useSelector((state: RootState) => state.status);

  useEffect(() => {
    dispatch(fetchStatus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadStr = currentVideo ? currentVideo.filename : '– none –';

  return (
    <div className="p-grid">
      <StatusCard title="External IP" content={externalIP} />
      <StatusCard title="Online" content={isOnline ? '✔' : '❌'} />
      <StatusCard title="Last Update" content={lastUpdate ? formatDate(lastUpdate) : ''} />
      <StatusCard title="Current Download" content={downloadStr} />
    </div>
  );
};

export default Status;

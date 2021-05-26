import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate } from 'utils/helpers';
import { RootState } from 'store';
import StatusCard from './StatusCard';
import { fetchStatus } from './statusSlice';

const Status: React.FC = () => {
  const dispatch = useDispatch();
  const { country, isOnline, currentVideo, lastUpdate } = useSelector((state: RootState) => state.status);

  useEffect(() => {
    dispatch(fetchStatus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadStr = currentVideo ? currentVideo.filename : '–';

  return (
    <div className="p-grid">
      <StatusCard title="VPN Online" content={isOnline ? '✔' : '❌'} />
      <StatusCard title="VPN Country" content={country} />
      <StatusCard title="Last Update" content={lastUpdate ? formatDate(lastUpdate, 'time') : ''} />
      <StatusCard title="Current Download" content={downloadStr} />
    </div>
  );
};

export default Status;

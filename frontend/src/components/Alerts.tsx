import { Growl } from 'primereact/growl';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAlert } from '../features/globals/globalSlice';
import { RootState } from '../store';

const Alerts: React.FC = () => {
  const alerts = useSelector((state: RootState) => state.globals.alerts);
  const dispatch = useDispatch();
  const growlEl = useRef<any>(null);

  useEffect(() => {
    Object.keys(alerts).forEach((key) => {
      growlEl.current?.show({
        severity: key,
        summary: alerts[key].summary,
        detail: alerts[key].detail,
      });

      dispatch(clearAlert(key));
    });
  }, [dispatch, alerts]);

  return <Growl ref={growlEl} />;
};

export default Alerts;

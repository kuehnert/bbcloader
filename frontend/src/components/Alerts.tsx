import { Toast } from 'primereact/toast';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAlert } from '../features/globals/globalSlice';
import { RootState } from '../store';

const Alerts: React.FC = () => {
  const alerts = useSelector((state: RootState) => state.globals.alerts);
  const dispatch = useDispatch();
  const toastEl = useRef<any>(null);

  useEffect(() => {
    Object.keys(alerts).forEach((key) => {
      toastEl.current?.show({
        severity: key,
        summary: alerts[key].summary,
        detail: alerts[key].detail,
      });

      dispatch(clearAlert(key));
    });
  }, [dispatch, alerts]);

  return <Toast ref={toastEl} />;
};

export default Alerts;

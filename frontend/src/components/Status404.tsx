import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import myhistory from '../myhistory';
import { setNotFound } from '../features/globals/globalSlice';
import { RootState } from 'store';

const Status404: React.FC = () => {
  const error = useSelector((state: RootState) => state.globals.notFound);
  const dispatch = useDispatch();

  const handleClearNotFound = () => {
    dispatch(setNotFound(null));
    myhistory.push('/');
  };

  return (
    <div className="layout-main">
      <div className="p-grid p-justify-center">
        <div className="p-col-6">
          <Card title="Nicht gefunden">
            <p>{error}</p>
            <p>Entweder es gibt die Seite nicht, oder Du hast nicht die erforderlichen Rechte, sie aufzurufen.</p>
          </Card>

          <Button label="Zurück" icon="mdi mdi-arrow-left" onClick={handleClearNotFound} />
        </div>
      </div>
    </div>
  );
};

export default Status404;

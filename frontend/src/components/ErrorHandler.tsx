import Status404 from './Status404';
import Layout from 'layout/Layout';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const ErrorHandler: React.FC = () => {
  const notFound = useSelector((state: RootState) => state.globals.notFound);

  return (
    <>
      {notFound && <Status404 />}
      {!notFound && <Layout />}
    </>
  );
};

export default ErrorHandler;

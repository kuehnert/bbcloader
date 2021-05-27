import Status404 from 'components/Status404';
import AvailableIndex from 'features/available/AvailableIndex';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import LoginPage from '../features/users/LoginPage';
import CompletedIndex from '../features/completed/CompletedIndex';
import EditDownload from '../features/downloads/EditDownload';
import DownloadsPage from '../features/downloads/DownloadIndex';

function Routes(): JSX.Element {
  return (
    <Switch>
      <Route path="/login" exact component={LoginPage} />
      {/* <Route path="/signup" exact component={SignUpPage} /> */}

      <ProtectedRoute path="/" exact component={DownloadsPage} />
      <ProtectedRoute path="/downloads/:bbcID/edit" component={EditDownload} />
      <ProtectedRoute path="/available" component={AvailableIndex} />
      <ProtectedRoute path="/completed" component={CompletedIndex} />

      <Route component={Status404} />
    </Switch>
  );
}

export default Routes;

import Status404 from 'components/Status404';
import AvailableIndex from 'features/available/AvailableIndex';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import EditVideo from './features/videos/EditVideo';
import VideosPage from './features/videos/VideoIndex';
import CompletedIndex from './features/completed/CompletedIndex'

function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={VideosPage} />
      <Route path="/downloads/:id/edit" component={EditVideo} />

      <Route path="/available" component={AvailableIndex} />
      <Route path="/completed" component={CompletedIndex} />

      <Route component={Status404} />
    </Switch>
  );
}

export default Routes;

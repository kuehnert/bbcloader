import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from './myhistory';
import VideosPage from './views/VideosPage';
import EditVideo from './features/videos/EditVideo';
import Status404 from 'components/Status404';

function Routes() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={VideosPage} />
        <Route path="/downloads/:id/edit" component={EditVideo} />

        <Route component={Status404} />
      </Switch>
    </Router>
  );
}

export default Routes;

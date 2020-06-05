import React from 'react';
import { Router, Route } from 'react-router-dom';
import history from './myhistory';
import VideosPage from './views/VideosPage';
// import EditVideo from './features/videos/EditVideo.tsx.bk';

function Routes() {
  return (
    <Router history={history}>
      <Route path="/" exact component={VideosPage} />
      {/* <Route path="/videos/edit/:id" component={EditVideo} /> */}
    </Router>
  );
}

export default Routes;

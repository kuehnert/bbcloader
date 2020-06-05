import React from 'react';
import { Router, Route } from 'react-router-dom';
import history from './history';
import VideosPage from './views/VideosPage';
import EditVideo from './components/EditVideo';

function App() {
  return (
    <Router history={history}>
      <Route path="/" exact component={VideosPage} />
      <Route path="/videos/edit/:id" component={EditVideo} />
      <Route path="/videos/delete/:id" component={null} />
    </Router>
  );
}

export default App;

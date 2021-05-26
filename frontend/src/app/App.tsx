import ErrorHandler from 'components/ErrorHandler';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import history from '../myhistory';
import store from '../store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <ErrorHandler />
      </Router>
    </Provider>
  );
};

export default App;

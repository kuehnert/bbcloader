import ErrorHandler from 'components/ErrorHandler';
import React from 'react';
import { Provider } from 'react-redux';
import store from './store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ErrorHandler />
    </Provider>
  );
};

export default App;

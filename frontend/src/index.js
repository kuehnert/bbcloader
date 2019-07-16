import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import reduxThunk from 'redux-thunk';
import App from './App';
import reducers from './reducers';
import { CssBaseline } from '@material-ui/core';
import Themed from './Themed';
// import './index.css';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(reduxThunk)));

ReactDOM.render(
  <Provider store={store}>
    <CssBaseline />
    <Themed>
      <App />
    </Themed>
  </Provider>,
  document.getElementById('root')
);

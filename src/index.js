import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';

import store from './store';
import {
  BrowserRouter,
  Route,
  Router
} from 'react-router-dom';
import history from './utils/history';

import './styles/index.css';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Provider store={ store }>
    <BrowserRouter>
      <Router history={ history }>
        <Route path="/" component={ App } />
      </Router>
    </BrowserRouter>
  </Provider>
  , document.getElementById('root')
);

registerServiceWorker();

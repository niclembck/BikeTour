import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import reduxThunk from 'redux-thunk';
import reducers from './reducers';

const middlewares = [reduxThunk];

if (process.env.NODE_ENV === 'development') {
  console.log('store - development mode');
  const logger = createLogger({
    level: 'info'
  });

  middlewares.push(logger);
}

const store = createStore(
  reducers,
  applyMiddleware(...middlewares)
);

export default store;

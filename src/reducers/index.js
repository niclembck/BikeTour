import { combineReducers } from 'redux';
import domainStateReducers from './domain.rootReducer';

const appReducer = combineReducers({
  domain: domainStateReducers
});

// https://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store/35641992#35641992
// add USER_LOGOUT at the root level to clear all reducer values on logout
const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined
  }

  return appReducer(state, action)
};

export default rootReducer;

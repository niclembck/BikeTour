import { combineReducers } from 'redux';
import domainStravaReducer from './strava.reducer';

export default combineReducers({
  strava: domainStravaReducer
});

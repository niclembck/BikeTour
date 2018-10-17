import { stravaDomainTypes } from '../actions/strava.actions';

export const INITIAL_STATE = {
  activityList: {
    data: [],
    isFetching: false
  }
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case stravaDomainTypes.SET_ACTIVITY_LIST:
      return {
        ...state,
        activityList: {
          ...state.activityList,
          data: action.payload
        }
      };
    case stravaDomainTypes.ACTIVITY_LIST_IS_FETCHING:
      return {
        ...state,
        activityList: {
          ...state.activityList,
          isFetching: action.payload
        }
      };
    default:
      return state;
  }
}

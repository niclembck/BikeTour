import * as stravaAPI from '../api/stravaAPI';

const domainPrefix = 'domain';

export const stravaDomainTypes = {
  SET_ACTIVITY_LIST: `${domainPrefix}/strava/SET_ACTIVITY_LIST`,
  ACTIVITY_LIST_IS_FETCHING: `${domainPrefix}/strava/ACTIVITY_LIST_IS_FETCHING`
};

// -----------------------------------
// ACTIVITY LIST
// -----------------------------------
export const setActivityList = (activities) => ({
  type: stravaDomainTypes.SET_ACTIVITY_LIST,
  payload: activities
});

export const fetchingActivityList = (isFetching) => ({
  type: stravaDomainTypes.ACTIVITY_LIST_IS_FETCHING,
  payload: isFetching
});

export const fetchActivityList = () => dispatch => {
  dispatch(fetchingActivityList(true));
  stravaAPI.getActivities()
    .then(res => {
      dispatch(setActivityList(res));
      dispatch(fetchingActivityList(false));
      return res;
    })
    .catch(err => {
      dispatch(fetchingActivityList(false));
      return err;
    });
};

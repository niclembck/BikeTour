import _ from 'lodash';

export const getActivityList = (state) => _.get(state, 'domain.strava.activityList.data');

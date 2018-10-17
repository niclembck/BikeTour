import axios from 'axios';
import stravaConfig from '../config/stravaConfig';

const baseUrl = 'http://www.strava.com/api/v3';
const { userId, access_token, clientId, clientSecret } = stravaConfig;

const defaultParams = {
  access_token: access_token,
  per_page: "200",
  client_id: clientId,
  client_secret: clientSecret,

};

export function getAuthInfo() {
  fetch('https://www.strava.com/oauth/authorize', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Origin': '',
      'Host': 'http://www.strava.com/api/v3'
    },
    body: JSON.stringify({
            client_id: clientId,
            redirect_uri: 'localhost',
            response_type: 'code',
            approval_prompt: 'auto',
            scope: 'public',
          })
  })
  .then(res => {
    console.log('res', res);
    return res.data
  });
}

export function getActivities(params = defaultParams) {
  return axios
    .get(`${baseUrl}/athlete/activities`, {
      params: params
    })
    .then(res => res.data)
    .catch(err => {
      console.error(err);
      return err;
    });
}

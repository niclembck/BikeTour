import axios from 'axios';
import _ from 'lodash';
import Promise from 'es6-promise';
import store from '../store';

const baseConfig = {
  withCredentials: true,
  maxRedirects: 0,
  headers: {
    post: {
      'Content-Type': 'application/json'
    }
  }
};

export default function createNewAxiosInstance(config) {
  const inst = axios.create(_.merge({}, baseConfig, config));

  // Add a response interceptor
  inst.interceptors.response.use(res => {
    return res;
  }, error => {
    const responseCode = _.get(error, 'response.status');
    return Promise.reject(error);
  });

  // Add a response interceptor
  inst.interceptors.request.use(cfg => {
    const newConfig = cfg;

    if (window.AXIOS_REQUEST_COOKIE) {
      newConfig.headers.common.Cookie = `sessionId="${window.AXIOS_REQUEST_COOKIE}";`;
    }

    return newConfig;
  }, (error) => Promise.reject(error));

  return inst;
}

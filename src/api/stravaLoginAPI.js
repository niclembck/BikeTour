/**
 * @file Simple JS Library for connecting to an API using OAuth.
 * @author Alyssa Davis <hello@alyda.me>
 * @link https://github.com/alycda

 * @requires Lo-dash
 * @requires mrdoob/eventdispatcher

 * @see https://github.com/iamstuartwilson/strava
 * @copyright Alyssa Davis 2015
 */




// don't need jQuery
var $client_id = document.querySelector('#client_id'),
    $client_secret = document.querySelector('#client_secret'),
    $access_token = document.querySelector('#access_token');

// grab from local storage
if(!$client_id.value && localStorage.getItem('client_id')) {
  $client_id.value = localStorage.getItem('client_id')
}
if(!$client_secret.value && localStorage.getItem('client_secret')) {
  $client_secret.value = localStorage.getItem('client_secret')
}
if(!$access_token.value && localStorage.getItem('access_token')) {
  $access_token.value = localStorage.getItem('access_token')
}

// respond to changes
function onInputChange(event) {
  localStorage.setItem(event.target.id, event.target.value);

  if (localStorage.getItem('access_token')) {
    api.init(localStorage.getItem('access_token'));
  } else if(localStorage.getItem('client_id') && localStorage.getItem('client_secret')) {
    api.init(parseInt(localStorage.getItem('client_id'), 10), localStorage.getItem('client_secret'));
  }
}

// listen for changes
$client_id.addEventListener('change', onInputChange);
$client_secret.addEventListener('change', onInputChange);
$access_token.addEventListener('change', onInputChange);

/** */
var client_id = parseInt(localStorage.getItem('client_id'), 10) || parseInt($client_id.value, 10);
    client_secret = localStorage.getItem('client_secret') || $client_secret.value;
    access_token = localStorage.getItem('access_token') || $access_token.value;

/**
 * @param {number} client_id
 * @param {string} client_secret
 * @param {string} [access_token]
 */
var CONFIG = (function(client_id, client_secret, access_token) {

  /**
   * @private
   * @readonly
   * @constant {string}
   */
  var BASE_URL = 'https://www.strava.com/';

  /** @protected */
  var _api_url = 'api/v3/',
      _auth_url = 'oauth/';

  /** @public */
  return {
    _api_url: BASE_URL + _api_url,
    _auth_url: BASE_URL + _auth_url,
    client_id: client_id,
    client_secret: client_secret,
    access_token: access_token
  }
})(client_id, client_secret, access_token);


/** @namespace */
var Alyda = Alyda || {};

/**
 * @requires lodash
 * @param {object} Namespace
 * @param {string} ClassName
 */
(function(Namespace, ClassName) {

  /** @protected */
  var _api_url = CONFIG._api_url,
      _auth_url = CONFIG._auth_url,
      _client_id,
      _client_secret;

  /** @private */
  var API = API || {},
      EVENTS = {},
      __access_token;

  /** @enum */
  EVENTS = {
    INITIALIZE: 'initialize',
    UNAUTHORIZED: 'unauthorized',
    AUTH_URL: 'auth_url',
    GET_CODE: 'get_code',
    TOKEN_EXCHANGE: 'token_exchange',
    SAVE_TOKEN: 'save_token',
    AUTHORIZED: 'authorized',
    REQUEST: 'request',
    DEAUTHORIZE: 'exit',
    ERROR: 'error'
  };

  /**
   * Documented as Namespace.ClassName
   * @alias Namespace.ClassName
   * @namespace
   * @public
   */
  var Class = {};

  /**
   * Get this party started.
   * @alias Namespace.ClassName.init
   * @function initialize
   * @param {number} a - client_id
   * @param {string} b - client_secret
   * -OR-
   * @param {string} a - access_token
   * @constructs
   * @this Class
   * @returns {string} state
   * @public
   *
   * @emits
   */
  Class.init = function initialize(a, b) {
    var self = this,
        message;

    self.dispatchEvent( { type: EVENTS.INITIALIZE, message: 'vroom vroom!' } );

    // a is a string (not empty) and no second parameter exists
    if (typeof a === 'string' && a !== "" && !b) {
      // we have an access token
      self.saveToken(a);

      message = 'access token: ' + a;
      self.dispatchEvent( { type: EVENTS.AUTHORIZED, message: message } );

    // a is a number (not NaN) and b is a string (not empty)
    // b is a number (not NaN) and a is a string (not empty)
    } else if(typeof a === 'number' && a !== NaN && typeof b === 'string' && b !== "" ||
              typeof b === 'number' && b !== NaN && typeof a === 'string' && a !== "") {
      // we have a client id (number) and a secret

      // set protected vars
      _client_id = typeof a === 'number' ? a : b;
      _client_secret = typeof a === 'number' ? b : a;

      message = 'client id: ' + a + ', client secret: ' + b
      self.dispatchEvent( { type: EVENTS.UNAUTHORIZED, message: message } );

    } else {
      message = "Either a 'Client ID' and 'Client Secret' are both required, or an 'Access Token' is required."
      console.error(a, b)
      self.dispatchEvent( { type: EVENTS.ERROR, message: Error(message) } );
    }

    var authorized = !!localStorage.getItem('token'),
        needToken = !!getQueryParam('code'),
        /** @readonly @enum {string} */
        states = ['first time', 'token exchange', 'authorized'],
        state = 0;

    // First time here, no 'token' in local storage, no 'code' in url params (?state=&code=827ds5...)
    if(!authorized && !needToken) {
      // state = 0;

    // Authorized, need token exchange
    } else if(needToken && !authorized) {
      state = 1;
      //message = getQueryParam('code');

      self.dispatchEvent( { type: EVENTS.TOKEN_EXCHANGE, message: getQueryParam('code') } );

    // have token, move along
    } else {

      // self.dispatchEvent( { type: EVENTS.AUTHORIZED } );
      state = 2;
    }

    return states[state]; // remove
  };

  /**
   * Generate authentication url.
   * @link https://strava.github.io/api/v3/oauth/#get-authorize
   * @alias Namespace.ClassName.auth
   * @function authenticationUrl
   * @param {string} [redirect=window.location.href]
   * @param {string} [approvalPrompt='auto']
   * @param {function} [callback]
   * @param {string} [scope]
   * @param {string} [state]
   * @returns {string} url
   * @public
   */
  Class.auth = function authenticationUrl(redirect, approvalPrompt, callback, scope, state) {
    if(!redirect) {
      redirect = window.location.href;
    }

    approvalPrompt = approvalPrompt || 'auto';

    /**
     * @property {object} parameters
     * @property {number} parameters.client_id
     * @property {string} parameters.redirect_uri
     * @property {string} parameters.response_type
     * @property {string} parameters.approval_prompt
     * @property {string} parameters.scope
     * @property {string} parameters.state
     */
    var parameters = {
      client_id: _client_id,
      redirect_uri: redirect,
      response_type: 'code',
      approval_prompt: approvalPrompt,
      scope: scope,
      state: state
    }

    if(callback) {
      /** @property {function} parameters.callback */
      _.extend(parameters, {callback: callback});
    }

    this.dispatchEvent( { type: EVENTS.AUTH_URL, message: parseGet(_auth_url + 'authorize', parameters) } );

    return parseGet(_auth_url + 'authorize', parameters);
  };

  /** @public */
  Class.getToken = function(code) {
    if(!code) {
      return console.error(Error('Code is required to exchange for token'));
    }

    /**
     * @property {object} parameters
     * @property {number} client_id
     * @property {string} client_secret
     * @property {string} code
     */
    var parameters = {
      client_id: _client_id,
      client_secret: _client_secret,
      code: code
    }

    //this.dispatchEvent( { type: EVENTS.TOKEN_EXCHANGE, message: code } ); Stack overflow

    return this.postJSON(_auth_url + 'token', parameters)
      .then(function(response){
        this.saveToken(response.access_token);
      }.bind(this)) //stackoverflow.com/a/16435819
      .then(function(){
        window.location.href = window.location.origin + window.location.pathname; // remove QueryString
      });
  };

  /**
   * Save access token.
   * @alias Namespace.ClassName.saveToken
   * @function setAccessToken
   * @param {string} token
   * @public
   */
  Class.saveToken = function setAccessToken(token) {
    localStorage.setItem('access_token', token);
    __access_token = token;

    this.dispatchEvent( { type: EVENTS.SAVE_TOKEN, message: token } );
  };

  /**
   * Send HTTP/1.1 GET request.
   * @augments, borrows, lends ???
   * @example
   * // returns the current athlete
   * Namespace.Classname.get('athlete');
   * @example
   * // returns the 100 most recent KOMs from specified athlete
   * Namespace.Classname.get('athletes/:id/koms', {per_page: 100});
   * @alias Namespace.ClassName.get
   * @function
   * @returns {object} JSON
   * @public
   */
  Class.getJSON = verb(); /*function(endpoint, parameters) {
    return this.fetchPromise(_api_url + endpoint, parameters).then(JSON.parse).then(function(response){console.log(response)});
  };*/

  /**
   * Send HTTP/1.1 PUT request.
   * @example
   * // update the current athlete's weight
   * Namespace.Classname.put('athlete', {weight: 82});
   * @alias Namespace.ClassName.put
   * @function
   * @returns {object} JSON
   * @public
   */
  Class.putJSON = verb('PUT');

  /**
   * Send HTTP/1.1 POST request.
   * @example
   * // add a new activity
   * Namespace.Classname.post('activities', {name: 'Test Ride', type: 'Ride', start_date_local: date('Y-m-d\TH:i:s\Z'), elapsed_time: 3600});
   * @alias Namespace.ClassName.post
   * @function
   * @returns {object} JSON
   * @public
   */
  Class.postJSON = verb('POST');

  /**
   * Send HTTP/1.1 DELETE request.
   * @example
   * // delete an activity
   * Namespace.Classname.delete('activites/:id');
   * @alias Namespace.ClassName.delete
   * @function
   * @returns {object} JSON
   * @public
   */
  Class.deleteJSON = verb('DELETE');

  /**
   * @param {string} [type='GET'] - Request type (GET, PUT, POST or DELETE)
   * @returns {function} Closure
   * @private
   */
  function verb(type) {
    type = type || 'GET';

    return function(endpoint, parameters) {
      var url = endpoint.match(/http/) ? endpoint : _api_url + endpoint;

      this.dispatchEvent( { type: EVENTS.REQUEST, message: type + ' ' + url } );

      return fetchPromise(url, parameters, type)
        .then(JSON.parse)
        .then(function(response){
          console.log(response)

          return response; // for chaining
        })
        .catch(function(error){
          console.error('JSON promise failed for: ', error); // url,
          throw error; // needed for this.getToken, otherwise
        })
        //.then(); // always
    }
  };

  /**
   * Sends HTTP Request to the API
   * @link https://www.html5rocks.com/en/tutorials/es6/promises/
   * @param {string} url
   * @param {object} [parameters]
   * @param {string} [request='GET'] - Request type (GET, PUT, POST or DELETE)
   * @returns {object} PROMISE
   * @private
   */
  function fetchPromise(url, parameters, requestType) {

    // All strava requests require an access_token (except the token exchange)
    parameters = generateParameters(parameters);
    // parameter is optional, sets default value
    requestType = requestType || 'GET'; // typeof requestType !== 'undefined' ? requestType : 'GET'

    API.last_request = url;
    API.last_request_data = parameters;

    //console.warn('promise:', url, parameters, requestType);

    // Return a new promise.
    return new Promise(function(resolve, reject) {
      //this.dispatchEvent( { type: EVENTS.PROMISE, message: 'pending' } );

      // let the promise do the error handling.
      if(!url) {
        reject(Error('URL is required.'));
        return;
      }

      // Do the usual XHR stuff
      var req = new XMLHttpRequest();
      req.open(requestType, parseGet(url, parameters));

      //req.onabort = function() {}
      //req.loadstart = function() {}
      //req.progress = function() {}

      //req.onload = onLoad;

      req.onload = function() {
        //console.debug(req)

        // This is called even on 404 etc
        // so check the status
        if (req.status == 200) {
          // Resolve the promise with the response text
          resolve(req.response);
          //this.dispatchEvent( { type: EVENTS.PROMISE, message: 'fulfilled' } );
        } else {
          // Otherwise reject with the status text
          // which will hopefully be a meaningful error
          reject(Error(req.statusText));
          //this.dispatchEvent( { type: EVENTS.PROMISE, message: 'rejected' } );
        }
      };

      //req.loadend = function() {}
      //req.readystatechange = function() {}
      //req.timeout = function() {}

      // Handle network errors
      req.onerror = function() {
        reject(Error("Network Error"));
      };

      // Make the request
      req.send();
    });
  };

  /**
   * Adds acces token to parameters before sending to API
   * @todo Not sure I like this function
   * @param {object} [parameters]
   * @returns {object} parameters
   * @private
   */
  function generateParameters(parameters) {
    if(typeof parameters !== 'object') {
      parameters = {};
    }

    if(!__access_token) {
      return parameters;
    }

    return _.extend(parameters, {access_token: __access_token});
  };

  /**
   * Appends query array onto url.
   * @todo I don't like this function
   * @param {string} url
   * @param {object} [parameters]
   * @returns {string} url
   * @private
   */
  function parseGet(url, parameters) {
    if(!url) {
      return;
    }

    var append = url.match(/\?/) ? '&' : '?';

    return url + append + buildQuery(parameters);
  };

  /**
   * @param {object} parameters
   * @returns {array} query string
   * @private
   */
  function buildQuery(parameters) {
    var query = [];

    /*Array.prototype.forEach.call(parameters, function(el, i){
      debugger;
    });*/

    _.forEach(parameters, function(value, param) {
      if(value) {
        query.push(param + '=' + value);
      }
    });

    return query.join('&');
  };

  /**
   * Revoke application access and delete access token.
   * @todo ...
   * @link https://strava.github.io/api/v3/oauth/#deauthorize
   * @alias Namespace.ClassName.exit
   * @function deAuthorize
   * @returns ... ?
   * @public
   */
  Class.exit = function deAuthorize() {
    localStorage.clear(); //removeItem(token);
    this.dispatchEvent( { type: EVENTS.DEAUTHORIZE } );

    return this.postJSON(_auth_url + 'deauthorize', generateParameters())
      .then(function(response){
        this.dispatchEvent( { type: EVENTS.UNAUTHORIZED } );
      }.bind(this)) //stackoverflow.com/a/16435819
  };

  // Public
  Namespace[ClassName] = Class;

})(Alyda, 'StravaAPI');

//github.com/mrdoob/eventdispatcher.js
EventDispatcher.prototype.apply(Alyda.StravaAPI);

var api = Alyda.StravaAPI,
    $auth = document.querySelector('.auth'),
    status;

function listen(event) {
  var t = event.target;

  console.log(String(event.type).toUpperCase(), event.message); // what about console.error ?

  switch(event.type) {
    case 'authorized' :

      $auth.innerHTML = '<a href="">De-authorize</a>';
      t.getJSON('athlete') // or api.getJSON
        /*.then(function(response){
          console.log(response);
        })*/

      //api.putJSON();
      //api.postJSON();
      //api.deleteJSON();

      break;

/*    case 'need_token':
      t.getToken(getQueryParam('code'));
      break;*/

    case 'token_exchange':
      t.getToken(getQueryParam('code'));

      break;

    case 'exit':
      $client_id.value = '';
      $client_secret.value = '';
      $access_token.value = '';
      break;

    default:
      $auth.innerHTML = '<a href="' + api.auth() + '">Authorize</a>'; // fix me
      break;
  }
}

// Listen for events.
api.addEventListener('initialize', listen);
api.addEventListener('unauthorized', listen);
//api.addEventListener('auth_url', listen); // causes infinite loop because it's called within the handler
api.addEventListener('need_token', listen);
api.addEventListener('token_exchange', listen);
api.addEventListener('save_token', listen);
api.addEventListener('authorized', listen);
api.addEventListener('request', listen);
api.addEventListener('exit', listen);
api.addEventListener('error', listen);

if(access_token !== "" ) {
  api.init(access_token);
} else if (client_id !== NaN && client_secret !== "") {
  api.init(client_id, client_secret);
} else {
  $client_id.focus();
  // hide button
}

// Utils
/** @ignore */
//youmightnotneedjquery.com/#extend

// forEach()

/** @ignore */
function getQuery() {
  return window.location.search.replace('?', '');
};

/** @ignore */
function getQueryParam(key) {
  var regex = new RegExp(key + '=', 'i'),
      value;

  if(getQuery().match(regex)) {

    _.forEach(getQuery().split('&'), function(param){
      var k = param.split('=')[0],
          val = param.split('=')[1];

      if(k === key) {
        value = val;
      }

    });

  }

  return value;
};

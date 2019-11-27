/**
 * @file Manages api requests: access tokens and authenticated requests
 */

// Constants

const ENDPOINT_DOMAIN = 'https://oauth.reddit.com';
const ACCESS_TOKEN_URL = 'https://www.reddit.com/api/v1/access_token';
const APP_ONLY_GRANT_TYPE = `${ENDPOINT_DOMAIN}/grants/installed_client`;
const DEVICE_ID = 'DO_NOT_TRACK_THIS_DEVICE';
const REQUEST_DELAY = 1000;


// Globals

const token = {
  accessToken: null,
  expirationDate: -Infinity,
};
let nextRequestTimestamp = -Infinity;


// Functions

/**
 * Enforces delay between API calls, ensures the ratelimit is never reached
 * @private
 *
 * @returns {Promise} A Promise that resolves after a delay
 */
function requestDelay() {
  const now = Date.now();
  const waitTime = nextRequestTimestamp - now;
  nextRequestTimestamp = Math.max(now, nextRequestTimestamp) + REQUEST_DELAY;
  return new Promise(resolve => setTimeout(resolve, waitTime));
}

/**
 * Requests access token from reddit api
 * @private
 *
 * @returns {Promise} A Promise for an object with token information
 */
function fetchAnonymousToken() {
  // populate request data
  const form = new FormData();
  form.set('grant_type', APP_ONLY_GRANT_TYPE);
  form.set('device_id', DEVICE_ID);

  // send request
  return fetch(ACCESS_TOKEN_URL, {
    method: 'POST',
    body: form,
    headers: { authorization: `Basic ${btoa(`${process.env.REDDIT_CLIENT_ID}:`)}` },
  }).then(response => response.text())
    .then(JSON.parse)
    .then((tokenInfo) => {
      token.accessToken = tokenInfo.access_token;
      if (tokenInfo.expires_in) {
        token.expirationDate = Date.now() + (tokenInfo.expires_in * 1000);
      } else {
        token.expirationDate = -Infinity;
        return Promise.reject();
      }

      return token.accessToken;
    });
}

/**
 * Gets valid access token
 * @private
 *
 * @returns {Promise} A Promise for the token
 */
function getAccessToken() {
  // fetch new token if expired
  if (Date.now() >= token.expirationDate) {
    return fetchAnonymousToken();
  }

  return Promise.resolve(token.accessToken);
}

/**
 * Make an authenticated request to reddit api
 *
 * @param {String} method The http action verb
 * @param {String} endpoint The reddit api endpoint
 * @param {Object} [options] Options for the request (`body`, 'params')
 *
 * @returns {Promise} A Promise with the response data
 */
export default function authRequest(method, endpoint, options = {}) {
  // create request url
  const params = new URLSearchParams(options.params);
  params.append('raw_json', 1);

  const url = new URL(`${ENDPOINT_DOMAIN}/${endpoint}`);
  url.search = params;

  // request body
  const body = options.body ? new URLSearchParams(options.body) : null;

  // send request
  return requestDelay()
    .then(() => getAccessToken())
    .then(accessToken => fetch(url, { method, body, headers: { authorization: `bearer ${accessToken}` } }))
    .then((response) => {
      // if invalid auth, invalidate token then retry once
      if (response.status === 401 && token.accessToken) {
        token.accessToken = null;
        token.expirationDate = -Infinity;
        return authRequest(method, endpoint, options);
      }
      if (!response.ok) {
        return Promise.reject();
      }

      return response.text().then(JSON.parse);
    });
}

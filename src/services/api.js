/**
 * @file Manages reddit api: access tokens and requests
 */

import Snoowrap from 'snoowrap';


// Constants

const ACCESS_TOKEN_URL = 'https://www.reddit.com/api/v1/access_token';
const APP_ONLY_GRANT_TYPE = 'https://oauth.reddit.com/grants/installed_client';
const DEVICE_ID = 'DO_NOT_TRACK_THIS_DEVICE';


// Globals

const token = {
  api: null,
  expirationDate: Date.now(),
};


// Functions

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
    .then(tokenInfo => tokenInfo);
}

/**
 * Conducts a search of reddit submissions
 *
 * @param {string} query The search query
 * @returns {Promise} A Snoowrap.Listing containing search results
 */
export default function search(query) {
  const urlQuery = `url:${query}`;

  if (Date.now() >= token.expirationDate) {
    return fetchAnonymousToken().then((tokenInfo) => {
      token.expirationDate = Date.now() + (tokenInfo.expires_in * 1000);
      token.api = new Snoowrap({ accessToken: tokenInfo.access_token });
      token.api.config({ proxies: false });

      return token.api.search({ query: urlQuery });
    });
  }

  return token.api.search({ query: urlQuery });
}

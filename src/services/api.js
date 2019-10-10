/**
 * @file Make requests to reddit api
 */


import authRequest from './request';


/**
 * Conducts a search of reddit submissions
 *
 * @param {string} query The search query
 * @param {string} sort Determines how the results should be sorted (relevance,
 *    hot, top, new, comments)
 * @param {int} limit The max number of submissions (maximum: 100)
 * @param {string} after The id of the previous submission
 * @returns {Promise} A reddit Listing containing search results
 */
export function search(query, sort, limit, after = null) {
  const urlQuery = `url:youtube.com/${query} OR url:youtu.be/${query}`;

  return authRequest(
    'get',
    'search',
    {
      params: {
        q: urlQuery,
        sort,
        after,
        limit,
      },
    },
  ).then(listing => ({ submissions: listing.data.children, nextSubmission: listing.data.after }));
}

/**
 * Get a the comment tree for a given submission
 *
 * @param {string} ID36 of a submission
 * @returns {Promise} A reddit Listing containing comment list
 */
export function getComments(submissionId) {
  return authRequest('get', `comments/${submissionId}`)
    .then(response => response[1].data.children);
}

/**
 * Get additional comments ommited from a base comment tree
 *
 * @param {string} linkId ID36 of a submission
 * @param {Array} children List of comment ID36s
 *
 * @returns {Promise} A reddit Listing containing comment list
 */
export function getMoreComments(linkId, children) {
  // TODO: check json.errors array?
  return authRequest(
    'post',
    'api/morechildren',
    {
      body: {
        link_id: linkId,
        children,
        api_type: 'json',
      },
    },
  ).then(response => response.json.data.things);
}

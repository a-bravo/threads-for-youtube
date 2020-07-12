/**
 * @file Make requests to reddit api
 */

import authRequest from './request';

/**
 * Conducts a search of reddit submissions
 *
 * @param {String} query The search query
 * @param {String} sort Determines how the results should be sorted (relevance,
 *    hot, top, new, comments)
 * @param {String} t Time frame for results (hour, day, week, month, year, all)
 * @param {Number} limit The max number of submissions (maximum: 100)
 * @param {String} [after] The id of the previous submission
 *
 * @returns {Promise} A reddit Listing containing search results
 */
export function search(query, sort, t, limit, after = null) {
  const urlQuery = `url:youtube.com/${query} OR url:youtu.be/${query}`;

  return authRequest(
    'get',
    'search',
    {
      params: {
        q: urlQuery,
        sort,
        t,
        after,
        limit,
      },
    },
  ).then((listing) => ({ submissions: listing.data.children, nextSubmission: listing.data.after }));
}

/**
 * Get a the comment tree for a given submission
 *
 * @param {String} submissionId ID36 of a submission
 * @param {Number} limit Maximum number of comments to return
 * @param {String} sort Determines how the results should be sorted (confidence,
 *    top, new, controversial, old, qa)
 *
 * @returns {Promise} A reddit Listing containing comment list
 */
export function getComments(submissionId, limit, sort) {
  return authRequest('get', `comments/${submissionId}`, { params: { limit, sort } })
    .then((response) => response[1].data.children);
}

/**
 * Get additional comments ommited from a base comment tree
 *
 * @param {String} linkId ID36 of a submission
 * @param {Array} children List of comment ID36s
 * @param {String} sort Determines how the results should be sorted (confidence,
 *    top, new, controversial, old, qa
 *
 * @returns {Promise} A reddit Listing containing comment list
 */
export function getMoreComments(linkId, children, sort) {
  return authRequest(
    'post',
    'api/morechildren',
    {
      body: {
        link_id: linkId,
        children,
        sort,
        api_type: 'json',
      },
    },
  ).then((response) => response.json.data.things);
}

/**
 * @file Make requests to reddit api
 */


import authRequest from './request';


// Globals

let comments = {};


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
      q: urlQuery,
      sort,
      after,
      limit,
    },
  ).then((listing) => {
    if (!after) {
      comments = {};
    }

    return {
      submissions: listing.data.children,
      after: listing.data.after,
    };
  });
}

/**
 * Get a the comment tree for a given submission
 *
 * @param {string} ID36 of a submission
 * @returns {Promise} A reddit Listing containing comment list
 */
export function getComments(submissionId) {
  const commentList = comments[submissionId];
  if (commentList) {
    return Promise.resolve(commentList);
  }

  return authRequest('get', `comments/${submissionId}`)
    .then((r) => {
      comments[submissionId] = r[1].data.children;
      return comments[submissionId];
    });
}

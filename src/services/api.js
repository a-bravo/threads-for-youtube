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
 * @returns {Promise} A reddit Listing containing search results
 */
export function search(query, sort) {
  const urlQuery = `url:youtube.com/${query} OR url:youtu.be/${query}`;

  return authRequest('get', 'search', { q: urlQuery, sort })
    .then((r) => {
      comments = {};
      return r.data.children;
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

/**
 * @file Load more comments/submissions Tests
 */

import { APP_ID, OPTIONS } from '../../src/constants';
import { VIDEO_URL, FIRST_COMMENT_ID } from './constants';

module.exports = {
  beforeEach(browser) {
    browser.execute('window.scrollTo(0, 0)') // reset scroll
  },

  'Open youtube video': function (browser) {
    browser
      .url(VIDEO_URL)
      .waitForElementVisible(`#${APP_ID}`)
  },

  'Load more submissions': function (browser) {
    browser
      .click(`#${APP_ID} #submission-list`)
      .waitForElementVisible(`#${APP_ID} .submission-list`)
      // match submissions
      .elements('css selector', `#${APP_ID} .submission-list .submission`, (result) => {
        browser
          .keys(browser.Keys.ESCAPE) // ensure any page popups are closed
          .click('.submission-list .more-button')
        browser.expect.elements(`#${APP_ID} .submission-list .submission`)
          .count.to.equal(result.value.length + OPTIONS.NUM_POSTS)
      })
      .assert.elementPresent('.submission-list .more-button')
  },

  'Load more submissions on comments tab': function (browser) {
    browser
      .click(`#${APP_ID} #comments-view`)
      .waitForElementVisible(`#${APP_ID} .submissions-sidebar`)
      // match submissions
      .elements('css selector', `#${APP_ID} .submissions-sidebar li`, (result) => {
        browser
          .keys(browser.Keys.ESCAPE) // ensure any page popups are closed
          .click('.submissions-sidebar .more-button')
        browser.expect.elements(`#${APP_ID} .submissions-sidebar li`)
          .count.to.equal(result.value.length + OPTIONS.NUM_POSTS)
      })
      .assert.elementPresent('.submissions-sidebar .more-button')
  },

  'Load more nested comments': function (browser) {
    browser
      .click(`#${APP_ID} #comments-view`)
      .waitForElementVisible(`#${APP_ID} .comment-list`)
      // match all comments
      .elements('css selector', `#${APP_ID} .comment-list .comment-container`, (firstResult) => {
        browser
          .keys(browser.Keys.ESCAPE) // ensure any page popups are closed
          .click(`#${APP_ID} #${FIRST_COMMENT_ID} .more-button`)
          .waitForElementVisible(`#${APP_ID} #${FIRST_COMMENT_ID} .replies .comment-container`)
          // match comments after the load
          .elements('css selector', `#${APP_ID} .comment-list .comment-container`, (loadMoreResult) => {
            browser.assert.ok(
              loadMoreResult.value.length > firstResult.value.length,
              'Length of comments should be greater after loading more'
            )
          })
      })
  },

  'Load more top-level comments': function (browser) {
    browser
      .click(`#${APP_ID} #comments-view`)
      .waitForElementVisible(`#${APP_ID} .comment-list`)
      // match all top level comments
      .elements('css selector', `#${APP_ID} .comment-list > .replies > .comment-container`, (firstResult) => {
        browser
          .keys(browser.Keys.ESCAPE) // ensure any page popups are closed
          .click(`#${APP_ID} .comment-list > .replies > .more .more-button`)
          .pause(5000)
          // match comments after the load
          .elements(
            'css selector', `#${APP_ID} .comment-list > .replies > .comment-container`,
            (loadMoreResult) => {
              browser.assert.ok(
                loadMoreResult.value.length > firstResult.value.length,
                'Length of top-level comments should be greater after loading more'
              )
            }
          )
      })
  },

  'end': function (browser) {
    browser
      .end()
  },
};

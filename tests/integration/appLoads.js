/**
 * @file Test App correctly loads into the page
 */

import {
  APP_ID,
  OPTIONS,
  COMPONENT_TABS,
  YT_COMMENTS_ID,
  YT_NAVBAR_ID,
  YT_LINK_CLASS,
  YT_CONTENT_RENDERER_CLASS,
  YT_VIDEO_ID,
  YT_VIDEO_TAG,
} from '../../src/constants';
import { VIDEO_URL } from './constants';

module.exports = {
  beforeEach(browser) {
    browser.execute('window.scrollTo(0, 0)') // reset scroll
  },

  'Open youtube video': function (browser) {
    browser
      .url(VIDEO_URL)
  },

  'Youtube classes & ids are still the same': function (browser) {
    browser
      .assert.elementPresent(`#${YT_COMMENTS_ID}`)
      .assert.elementPresent(`#${YT_NAVBAR_ID}`)
      .assert.elementPresent(`#${YT_VIDEO_ID}`)
      .assert.elementPresent(`${YT_VIDEO_TAG}`)
      .assert.elementPresent(`.${YT_LINK_CLASS}`)
      .assert.elementPresent(`.${YT_CONTENT_RENDERER_CLASS}`)
  },

  'mounts': function (browser) {
    browser
      .waitForElementVisible(`#${APP_ID}`)
  },

  'tab buttons': function (browser) {
    COMPONENT_TABS.forEach((tab) => {
      browser.assert.containsText(`#${APP_ID}`, tab.text);
    });
  },

  'default tab': function (browser) {
    browser.expect.elements(`#${APP_ID} .tabs .selected`).count.to.equal(1)
    browser.assert.cssClassPresent(`#${APP_ID} #${OPTIONS.DEFAULT_TAB}`, 'selected')
  },

  'comments not loaded': function (browser) {
    browser.assert.containsText(`#${APP_ID}`, 'Scroll to load...');
    // Trigger scroll events to load reddit comments/posts
    browser.execute('window.dispatchEvent(new CustomEvent("scroll"))')
    browser.execute('window.dispatchEvent(new CustomEvent("scroll"))')
    browser.execute('window.dispatchEvent(new CustomEvent("scroll"))')
    browser.execute('window.dispatchEvent(new CustomEvent("scroll"))')
  },

  'comments': function (browser) {
    browser
      .click(`#${APP_ID} #comments-view`)
      .assert.cssClassPresent(`#${APP_ID} #comments-view`, 'selected')
      .waitForElementVisible(`#${APP_ID} .comment-list`)
      .assert.elementPresent('.submissions-sidebar .more-button')
    browser.expect.elements(`#${APP_ID} .comment-list .comment-container`).count.to.equal(OPTIONS.NUM_COMMENTS)
    browser.expect.elements(`#${APP_ID} .submissions-sidebar li`).count.to.equal(OPTIONS.NUM_POSTS)
  },

  'posts': function (browser) {
    browser
      .click(`#${APP_ID} #submission-list`)
      .assert.cssClassPresent(`#${APP_ID} #submission-list`, 'selected')
      .assert.elementPresent('.submission-list .more-button')
    browser.expect.elements(`#${APP_ID} .submission-list .submission`).count.to.equal(OPTIONS.NUM_POSTS)
  },

  'YT comments': function (browser) {
    browser
      .click(`#${APP_ID} #youtube-comments-view`)
      .assert.cssClassPresent(`#${APP_ID} #youtube-comments-view`, 'selected')
      .execute('document.querySelector("#comments #sections").scrollIntoView()')
      .waitForElementVisible('#comments #sections #contents #comment')
  },

  'end': function (browser) {
    browser
      .end()
  },
};

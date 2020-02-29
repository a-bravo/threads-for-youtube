/**
 * @file DOM-related integration tests
 */

import { APP_ID, YT_COMMENTS_ID, YT_NAVBAR_ID } from '../../src/constants';
import { VIDEO_URL, FIRST_COMMENT_ID } from './constants';

module.exports = {
  'Open youtube video': function (browser) {
    browser
      .url(VIDEO_URL)
      .waitForElementVisible(`#${APP_ID}`)
  },

  'Back to top button': function (browser) {
    browser
      .keys(browser.Keys.ESCAPE) // ensure any page popups are closed
      .waitForElementVisible(`#${APP_ID} .comment-list`)
      .assert.not.elementPresent(`#${APP_ID} #to-top-button`)
      .execute('document.querySelector(".comment-list").scrollIntoView()')
      .assert.elementPresent(`#${APP_ID} #to-top-button`)
      .keys(browser.Keys.ESCAPE) // ensure any page popups are closed
      .click('#to-top-button')
      .assert.not.elementPresent(`#${APP_ID} #to-top-button`)
  },

  'Scrolling on collapsing comment': function (browser) {
    // ensure comment is in view after collapsing
    browser
      .waitForElementVisible(`#${APP_ID} .comment-list`)
      .waitForElementVisible(`#${APP_ID} .collapse-button`)
      .execute('window.scrollTo(0, 0)') // scroll to top
      .keys(browser.Keys.ESCAPE) // ensure any page popups are closed
      .execute((commentId) => {
        // dont use nightwatch `.click` since it scrolls when clicking
        document.querySelector(`#${commentId} .collapse-button`).click() // collapse comment

        // ensure scroll hasnt changed after collapsing comment
        return window.scrollY == 0
      }, [FIRST_COMMENT_ID], (result) => {
        browser.assert.ok(
          result.value,
          'Scroll should not change if scroll view above collapsing element'
        )
      })

      .click(`#${APP_ID} #${FIRST_COMMENT_ID} .collapse-button`) // uncollapse comment
      // scroll to bottom
      .moveToElement(`#${APP_ID} .comment-list > .replies > .more .more-button`, 0, 0, () => {
        browser
          .execute((commentId, navbarId) => {
            // dont use nightwatch `.click` since it scrolls when clicking
            document.querySelector(`#${commentId} .collapse-button`).click() // collapse comment

            // ensure scrolled to comment after collapsing comment
            const targetTop = document.getElementById(commentId).getBoundingClientRect().top;
            const navHeight = document.getElementById(navbarId).offsetHeight;
            const position = targetTop - navHeight;
            return -1 < position && position < 1
          }, [FIRST_COMMENT_ID, YT_NAVBAR_ID], (result) => {
            browser.assert.ok(
              result.value,
              'Should scroll to element if scroll view below collapsing element'
            )
          })
        })
  },

  'App location within DOM (next to YT comments)': function (browser) {
    // window resize moves elements around, ensure app is always a sibling of YT comments
    const windowSizes = [{}, {w: 1280, l: 1280}, {w: 600, l: 1280}];
    browser
      .perform(() => {
        windowSizes.forEach((size) => {
          if (size.w) {
            browser.resizeWindow(size.w, size.l);
          }

          browser.execute(
            (app, comments) => document.getElementById(app).nextSibling.id === comments,
            [APP_ID, YT_COMMENTS_ID],
            (result) => browser.assert.ok(result.value, 'App should be a sibling of YT comments'),
          );
        });
      });
  },

  'end': function (browser) {
    browser
      .end()
  },
};

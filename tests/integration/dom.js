/**
 * @file DOM-related integration tests
 */

import { APP_ID, YT_COMMENTS_ID } from '../../src/constants';
import { VIDEO_URL } from './constants';

module.exports = {
  'Open youtube video': function (browser) {
    browser
      .url(VIDEO_URL)
      .waitForElementVisible(`#${APP_ID}`)
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

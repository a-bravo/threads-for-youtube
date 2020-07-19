/**
* @file background entrypoint, listens for tab updates
*/

import browser from 'webextension-polyfill';

browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    browser.tabs.sendMessage(tabId, { videoChanged: { videoChanged: true } });
  }
});

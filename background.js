browser.webNavigation.onHistoryStateUpdated.addListener(
  details => {
    // only when history url === new tab url: send message to content_script
    browser.tabs.get(details.tabId).then(tabInfo => {
      if (tabInfo.url === details.url) {
        browser.tabs.sendMessage(details.tabId, { videoChanged: true });
      }
    });
  },
  { url: [{ urlContains: 'https://www.youtube.com/watch?v=' }] }
);

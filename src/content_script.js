/**
 * @file content_script entrypoint, starts/mounts app
 */

import Vue from 'vue';
import App from './App.vue';


// Constants
const COMMENTS_ID = 'comments';
const APP_ID = 'at-app';


// Functions

/**
 * Mount vue app to DOM
 * @private
 */
function mount(app) {
  // guard against non-video pages
  // occurs when: youtube pushes 2 history states (last page(video) & new page)
  const url = new URL(window.location.href);
  if (url.pathname !== '/watch' || !url.searchParams.get('v')) {
    // not a video
    return;
  }

  // mount app if needed
  if (!document.getElementById(APP_ID)) {
    // Insert app mounting point before comments div
    const vue = document.createElement('div');
    vue.id = APP_ID;
    const comments = document.getElementById(COMMENTS_ID);
    comments.before(vue);

    // Mount vue instance
    app.$mount(`#${APP_ID}`);
  }
}


// On content_script load...

// create vue instance
Vue.prototype.$browser = browser;
const app = new Vue({ // eslint-disable-line no-new
  render: h => h(App),
});

// watch for mounting elements to appear on page
let commentsAdded = false;
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (!mutation.addedNodes) {
      return;
    }

    mutation.addedNodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) {
        return;
      }

      // mount app if elements have been added
      if (!commentsAdded) {
        if (node.querySelector(`#${COMMENTS_ID}`)) {
          commentsAdded = true;
          mount(app);
          observer.disconnect();
        }
      }
    });
  });
});

// notify for changes to descendents of target
const observerConfig = {
  childList: true,
  subtree: true,
};

// start observing changes
const targetNode = document.body;
observer.observe(targetNode, observerConfig);

// listen for page change message from background script
browser.runtime.onMessage.addListener((message) => {
  if (message.videoChanged) {
    mount(app);
  }
});

// if mounting elements already present, mount and stop observing
if (document.getElementById(COMMENTS_ID) && !commentsAdded) {
  observer.disconnect();
  mount(app);
}

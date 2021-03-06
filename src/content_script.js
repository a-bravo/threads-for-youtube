/**
 * @file content_script entrypoint, starts/mounts app
 */

import Vue from 'vue';
import browser from 'webextension-polyfill';
import App from './App.vue';
import store from './services/store';
import { APP_ID, YT_COMMENTS_ID } from './constants';

// Functions

/**
 * Mount vue app to DOM
 * @private
 */
function mount(app) {
  // create div if needed
  if (!document.getElementById(APP_ID)) {
    // Insert app mounting point before comments div
    const vue = document.createElement('div');
    vue.id = APP_ID;
    const comments = document.getElementById(YT_COMMENTS_ID);
    comments.before(vue);
  }

  // Mount vue instance to div
  app.$mount(`#${APP_ID}`);
}

// On content_script load...

// create vue instance
Vue.prototype.$browser = browser;
const app = new Vue({ // eslint-disable-line no-new
  data: store,
  render: (h) => h(App),
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
        if (node.querySelector(`#${YT_COMMENTS_ID}`)) {
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

// if mounting elements already present, mount and stop observing
if (document.getElementById(YT_COMMENTS_ID) && !commentsAdded) {
  observer.disconnect();
  mount(app);
}

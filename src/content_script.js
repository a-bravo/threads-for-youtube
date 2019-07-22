// Put all the javascript code here, that you want to execute after page load.

import Vue from 'vue';
import App from './App.vue';


function init() {
  // guard against non-video pages
  // occurs when: youtube pushes 2 history states (last page(video) & new page)
  const url = new URL(window.location.href);
  if (url.pathname !== '/watch' || !url.searchParams.get('v')) {
      // not a video
      return;
  }

  // create vue app if needed
  if (!document.getElementById('at-app')) {
    // Insert app div before comments div
    const vue = document.createElement('div');
    vue.id = 'at-app'
    const comments = document.getElementById('comments');
    comments.before(vue);

    // Create vue instance
    new Vue({
      el: '#at-app',
      render: h => h(App),
    });
  }
}

// listen for page change message from background script
browser.runtime.onMessage.addListener(message => {
  if (message.videoChanged) {
    init();
  }
});


// init when page is first loaded
init();

// Put all the javascript code here, that you want to execute after page load.

function init() {
  // guard against non-video pages
  // occurs when: youtube pushes 2 history states (last page(video) & new page)
  const url = new URL(window.location.href);
  if (url.pathname !== '/watch' || !url.searchParams.get('v')) {
      // not a video
      return;
  }

  // do stuff
}

// listen for page change message from background script
browser.runtime.onMessage.addListener(message => {
  if (message.videoChanged) {
    init();
  }
});


// init when page is first loaded
init();

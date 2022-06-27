window.prevBookmark = null;

browser.runtime.onMessage.addListener((message, callback) => {
  switch (message.action) {
    case 'setPrevBookmark':
      window.prevBookmark = message.prevBookmark;
      break;
  }
});

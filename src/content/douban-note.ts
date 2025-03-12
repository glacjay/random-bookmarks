// Clean up Douban note URLs by removing query parameters
const cleanUrlIfNeeded = () => {
  if (window.location.href.match(/^https?:\/\/.*?douban\.com\/note\//)) {
    setTimeout(() => {
      const url = new URL(window.location.href);
      if (url.search) {
        history.replaceState(null, "", `${url.pathname}${url.hash}`);
      }
    }, 2000);
  }
};

export function initDoubanUrlCleaner() {
  // Clean on initial load
  cleanUrlIfNeeded();

  // Monitor URL changes
  let lastUrl = window.location.href;
  const observer = new MutationObserver(() => {
    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href;
      cleanUrlIfNeeded();
    }
  });

  observer.observe(document, { subtree: true, childList: true });
}

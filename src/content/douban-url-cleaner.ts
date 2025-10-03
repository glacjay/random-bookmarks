// Clean up Douban URLs by removing _i parameter
const cleanUrlIfNeeded = () => {
  if (window.location.href.match(/^https?:\/\/.*?douban\.com\//)) {
    setTimeout(() => {
      const url = new URL(window.location.href);
      for (let paramToClean of ["_i", "_spm_id"]) {
        if (url.searchParams.has(paramToClean)) {
          url.searchParams.delete(paramToClean);
          const newSearch = url.searchParams.toString();
          history.replaceState(
            null,
            "",
            `${url.pathname}${newSearch ? "?" + newSearch : ""}${url.hash}`,
          );
        }
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

import React, { Fragment, useCallback, useEffect, useState } from "react";
import browser from "webextension-polyfill";

async function getCurrentTabUrl() {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  return tabs[0]?.url || "";
}

export function UrlUpdater() {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    getCurrentTabUrl().then((url) => setCurrentUrl(url));
  }, []);

  const handleUrlUpdate = useCallback(async () => {
    try {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab.id) return;

      await browser.tabs.executeScript({
        code: `history.replaceState({}, '', ${JSON.stringify(currentUrl)});`,
      });
      window.close();
    } catch (error) {
      console.error("Failed to update URL:", error);
    }
  }, [currentUrl]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleUrlUpdate();
      }
    },
    [handleUrlUpdate],
  );

  return (
    <Fragment>
      <hr style={{ width: "100%" }} />

      <div style={{ display: "flex", margin: "8px 0", alignItems: "center" }}>
        <input
          type="text"
          value={currentUrl}
          onChange={(e) => setCurrentUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ flex: 1, marginRight: 8 }}
        />
        <button onClick={handleUrlUpdate}>Update URL</button>
      </div>
    </Fragment>
  );
}

import React, { useCallback, useEffect, useState } from 'react';

const RANDOM_TAB_KEY = 'randomTab';

function useRandomTab() {
  const [randomTab, setRandomTab] = useState(null);

  useEffect(() => {
    const loadRandomTab = async () => {
      const results = await browser.storage.local.get(RANDOM_TAB_KEY);
      setRandomTab(results?.randomTab);
    };
    loadRandomTab();

    const listener = (changes) => {
      for (const key of Object.keys(changes)) {
        if (key === RANDOM_TAB_KEY) {
          setRandomTab(changes[key].newValue);
        }
      }
    };
    browser.storage.local.onChanged.addListener(listener);
    return () => browser.storage.local.onChanged.removeListener(listener);
  }, []);

  return randomTab;
}

export function RandomTab() {
  const randomTab = useRandomTab();

  const pickRandomTab = useCallback(async () => {
    const tabs = await browser.tabs.query({ currentWindow: true });
    const index = Math.floor(Math.random() * tabs.length);
    const selectedTab = tabs[index];
    console.log('xxx', { index, selectedTab });
    browser.storage.local.set({ [RANDOM_TAB_KEY]: selectedTab });
    browser.tabs.update(selectedTab.id, { active: true });
  }, []);

  return (
    <div>
      <hr style={{ width: '100%' }} />

      <button onClick={pickRandomTab}>Random Tab</button>
      {!!randomTab && (
        <p>
          current random tab: <a href={randomTab.url}>{randomTab.title}</a>
        </p>
      )}
    </div>
  );
}

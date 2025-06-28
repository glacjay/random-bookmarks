import React, { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";

const RANDOM_TAB_KEY = "randomTab";
const SURROUNDING_COUNT = 7;
const HALF_SURROUNDING_COUNT = Math.floor(SURROUNDING_COUNT / 2);

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
  let randomTab = useRandomTab();

  let { data: tabsCount } = useQuery("tabsCount", async () => {
    const tabs = await browser.tabs.query({ currentWindow: true });
    return tabs.length;
  });

  let { data: allTabsCount } = useQuery("allTabsCount", async () => {
    // 包含隐私窗口的标签页
    const tabs = await browser.tabs.query({});
    return tabs.length;
  });

  let pickRandomTab = useCallback(async () => {
    const tabs = await browser.tabs.query({ currentWindow: true });
    const index = Math.floor(Math.random() ** 2 * tabs.length);
    const selectedTab = tabs[index];
    const surroundingTabs = tabs.slice(
      Math.max(0, index - HALF_SURROUNDING_COUNT),
      Math.min(tabs.length, index + HALF_SURROUNDING_COUNT + 1),
    );
    browser.storage.local.set({
      [RANDOM_TAB_KEY]: { selectedTab, surroundingTabs },
    });
    browser.tabs.update(selectedTab.id, { active: true });
  }, []);

  let pickRandomTabFromAllWindows = useCallback(async () => {
    try {
      // 查询所有窗口的标签页，尝试包括隐私窗口
      const tabs = await browser.tabs.query({});

      if (tabs.length === 0) {
        console.warn(
          "No tabs found. This might be due to privacy/incognito restrictions.",
        );
        return;
      }

      const index = Math.floor(Math.random() ** 2 * tabs.length);
      const selectedTab = tabs[index];
      const surroundingTabs = tabs.slice(
        Math.max(0, index - HALF_SURROUNDING_COUNT),
        Math.min(tabs.length, index + HALF_SURROUNDING_COUNT + 1),
      );
      browser.storage.local.set({
        [RANDOM_TAB_KEY]: { selectedTab, surroundingTabs },
      });

      // 先激活标签页，再切换窗口焦点
      // 注意：不能先切换窗口再激活标签页，因为当窗口切换后，
      // 标签页激活操作可能会失效或被忽略，导致切换了窗口但标签页没有正确激活
      await browser.tabs.update(selectedTab.id, { active: true });
      await browser.windows.update(selectedTab.windowId, { focused: true });
    } catch (error) {
      console.error(
        "Error accessing tabs (possibly due to privacy restrictions):",
        error,
      );
    }
  }, []);

  return (
    <div>
      <hr style={{ width: "100%" }} />

      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <button
          onClick={pickRandomTab}
          style={{
            padding: "8px 16px",
            background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
            color: "#1976d2",
            border: "1px solid #90caf9",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background =
              "linear-gradient(135deg, #bbdefb 0%, #90caf9 100%)";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background =
              "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)";
            e.target.style.transform = "translateY(0)";
          }}
        >
          Random Tab
        </button>
        <span style={{ fontSize: "12px", color: "#666" }}>({tabsCount})</span>

        <button
          onClick={pickRandomTabFromAllWindows}
          style={{
            padding: "8px 16px",
            background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
            color: "#388e3c",
            border: "1px solid #81c784",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background =
              "linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background =
              "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)";
            e.target.style.transform = "translateY(0)";
          }}
        >
          All Windows
        </button>
        <span style={{ fontSize: "12px", color: "#666" }}>
          ({allTabsCount})
        </span>
      </div>

      {randomTab?.surroundingTabs?.map((tab) => (
        <p
          key={tab.id}
          style={{
            color: tab.id === randomTab?.selectedTab?.id ? "red" : "black",
          }}
        >
          <button
            onClick={() => browser.tabs.update(tab.id, { active: true })}
            style={{
              background: "none",
              padding: 0,
              color: tab.id === randomTab?.selectedTab?.id ? "red" : "black",
            }}
          >
            tab
          </button>
          : <a href={tab.url}>{tab.title}</a>
        </p>
      ))}
    </div>
  );
}

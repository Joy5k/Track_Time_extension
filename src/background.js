const socialMediaSites = [
    'facebook.com',
    'instagram.com',
    'twitter.com',
    'youtube.com',
    'tiktok.com',
    'linkedin.com'
  ];
  
  let activeTabId = null;
  let activeStartTime = null;
  let timeSpent = {};
  
  // Initialize timeSpent object from storage
  chrome.storage.local.get(['timeSpent'], (result) => {
    if (result.timeSpent) {
      timeSpent = result.timeSpent;
    }
  });
  
  function updateTimeSpent() {
    if (activeTabId && activeStartTime) {
      const now = Date.now();
      const timeSpentOnTab = now - activeStartTime;
  
      chrome.tabs.get(activeTabId, (tab) => {
        if (chrome.runtime.lastError) return;
        const url = new URL(tab.url);
        const domain = url.hostname.replace('www.', '');
  
        if (socialMediaSites.includes(domain)) {
          if (!timeSpent[domain]) {
            timeSpent[domain] = 0;
          }
          timeSpent[domain] += timeSpentOnTab;
          chrome.storage.local.set({ timeSpent });
        }
      });
    }
  }
  
  chrome.tabs.onActivated.addListener((activeInfo) => {
    updateTimeSpent();
    activeTabId = activeInfo.tabId;
    activeStartTime = Date.now();
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tabId === activeTabId && changeInfo.status === 'complete') {
      updateTimeSpent();
      activeStartTime = Date.now();
    }
  });
  
  chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabId === activeTabId) {
      updateTimeSpent();
      activeTabId = null;
      activeStartTime = null;
    }
  });
  
  chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      updateTimeSpent();
      activeTabId = null;
      activeStartTime = null;
    } else {
      chrome.tabs.query({ active: true, windowId }, (tabs) => {
        if (tabs.length === 1) {
          activeTabId = tabs[0].id;
          activeStartTime = Date.now();
        }
      });
    }
  });
  
  chrome.windows.onRemoved.addListener(() => {
    updateTimeSpent();
  });
  
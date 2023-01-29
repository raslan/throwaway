/// <reference types="chrome"/>
// Listen for messages from the frontend and call autofill.

chrome.contextMenus.create(
  {
    id: 'autofill',
    title: 'Fill with Throwaway',
    contexts: ['page', 'editable'],
  },
  () => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
    }
  }
);

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'autofill') {
    chrome.storage.local.get(
      ['identity', 'throwaway_env'],
      ({ identity, throwaway_env }) => {
        chrome.scripting.executeScript({
          target: { tabId: tab?.id as number },
          files: ['content-script.ts.js'],
        });
        chrome.tabs.sendMessage(tab?.id as number, {
          ...JSON.parse(identity),
          env: {
            ...JSON.parse(throwaway_env),
          },
        });
      }
    );
  }
});

chrome.runtime.onMessage.addListener((message) => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content-script.ts.js'],
          });
          chrome.tabs.sendMessage(tab.id, message);
        }
      });
    }
  );
  return true;
});

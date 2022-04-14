/// <reference types="chrome"/>
// Listen for messages from the frontend and call autofill.
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
            files: ["content-script.ts.js"],
          });
          chrome.tabs.sendMessage(tab.id, message);
        }
      });
    }
  );
  return true;
});

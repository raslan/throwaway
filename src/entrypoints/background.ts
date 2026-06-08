export default defineBackground(() => {
  browser.contextMenus.create(
    {
      id: 'autofill',
      title: 'Fill with Throwaway',
      contexts: ['page', 'editable'],
    },
    () => {
      if (browser.runtime.lastError) {
        console.error(browser.runtime.lastError.message);
      }
    }
  );

  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'autofill') {
      browser.storage.local.get(
        ['identity', 'throwaway_env'],
        ({ identity, throwaway_env }) => {
          browser.scripting.executeScript({
            target: { tabId: tab?.id as number },
            files: ['content-scripts/content.js'],
          });
          browser.tabs.sendMessage(tab?.id as number, {
            ...JSON.parse(identity),
            env: {
              ...JSON.parse(throwaway_env),
            },
          });
        }
      );
    }
  });

  browser.runtime.onMessage.addListener((message) => {
    browser.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        tabs.forEach((tab) => {
          if (tab.id) {
            browser.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['content-scripts/content.js'],
            });
            browser.tabs.sendMessage(tab.id, message);
          }
        });
      }
    );
    return true;
  });
});

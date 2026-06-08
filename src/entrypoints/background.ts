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
    if (info.menuItemId !== 'autofill' || !tab?.id) return;

    browser.storage.local
      .get(['identity', 'throwaway_env'])
      .then(({ identity, throwaway_env }) => {
        if (!identity || !throwaway_env) return;

        let parsedIdentity, parsedEnv;
        try {
          parsedIdentity = JSON.parse(identity);
          parsedEnv = JSON.parse(throwaway_env);
        } catch (e) {
          console.error('Failed to parse extension state:', e);
          return;
        }

        browser.tabs
          .sendMessage(tab.id as number, { ...parsedIdentity, env: parsedEnv })
          .catch((e) => console.error('sendMessage failed:', e));
      });
  });

  browser.runtime.onMessage.addListener((message) => {
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then((tabs) => {
        tabs.forEach((tab) => {
          if (tab.id) {
            browser.tabs
              .sendMessage(tab.id, message)
              .catch((e) => console.error('sendMessage failed:', e));
          }
        });
      });
    return true;
  });
});

import parse from 'parse-otp-message';

export default defineBackground(() => {
  browser.contextMenus.removeAll().then(() => {
    browser.contextMenus.create({
      id: 'autofill',
      title: 'Fill with Throwaway',
      contexts: ['page', 'editable'],
    });
  });

  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId !== 'autofill' || !tab?.id) return;

    browser.storage.local
      .get(['identity', 'throwaway_env'])
      .then(async ({ identity, throwaway_env }) => {
        if (!identity || !throwaway_env) return;

        let parsedIdentity: Record<string, string>,
          parsedEnv: Record<string, string>;
        try {
          parsedIdentity = JSON.parse(identity);
          parsedEnv = JSON.parse(throwaway_env);
        } catch (e) {
          console.error('Failed to parse extension state:', e);
          return;
        }

        if (parsedEnv?.VITE_API_URL && parsedIdentity?.email) {
          try {
            const res = await fetch(
              `${parsedEnv.VITE_API_URL}/${parsedIdentity.email}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: parsedEnv.token }),
              }
            );
            const { emails } = await res.json();
            if (emails?.length) {
              const lastEmail = emails[0];
              const content = lastEmail?.body_text || lastEmail?.body_html;
              const currentYear = new Date().getFullYear().toString();
              const { code } =
                parse(content?.replace?.(currentYear, '')) ?? { code: '' };
              if (code) {
                parsedIdentity.otp = code;
                parsedIdentity.code = code;
                parsedIdentity.verification_code = code;
              }
            }
          } catch (e) {
            console.error('OTP fetch failed, using cached value:', e);
          }
        }

        // Send without env — content script won't attempt its own fetch
        browser.tabs
          .sendMessage(tab.id as number, parsedIdentity)
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

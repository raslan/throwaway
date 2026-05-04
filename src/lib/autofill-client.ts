import { directAutofillPage } from '@/lib/direct-autofill';

export type AutofillResult = {
  ok: boolean;
  filled: number;
  error?: string;
};

export const generateCode = (otp: string) => ({
  otp,
  code: otp,
  verification_code: otp,
});

const runDirectAutofill = (message: Record<string, unknown>) =>
  new Promise<AutofillResult>((resolve) => {
    if (!chrome?.tabs?.query || !chrome?.scripting?.executeScript) {
      resolve({
        ok: false,
        filled: 0,
        error: 'Extension scripting APIs are unavailable.',
      });
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (!tab?.id) {
        resolve({ ok: false, filled: 0, error: 'No active tab found.' });
        return;
      }

      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id, allFrames: true },
          args: [message],
          func: directAutofillPage,
        },
        (results) => {
          const error = chrome.runtime.lastError?.message;
          if (error) {
            resolve({ ok: false, filled: 0, error });
            return;
          }

          const filled = (results || []).reduce(
            (count, frameResult) => count + (Number(frameResult.result) || 0),
            0
          );
          resolve({ ok: true, filled });
        }
      );
    });
  });

const runBackgroundAutofill = (message: Record<string, unknown>) =>
  new Promise<AutofillResult>((resolve) => {
    if (!chrome?.runtime?.sendMessage) {
      resolve({
        ok: false,
        filled: 0,
        error: 'Extension runtime is unavailable.',
      });
      return;
    }

    chrome.runtime.sendMessage(message, (response?: AutofillResult) => {
      const error = chrome.runtime.lastError?.message;
      if (error) {
        resolve({ ok: false, filled: 0, error });
        return;
      }

      resolve(
        response || {
          ok: false,
          filled: 0,
          error: 'No autofill response received.',
        }
      );
    });
  });

export const fill = async (message: Record<string, unknown>) => {
  const direct = await runDirectAutofill(message);
  if (direct.ok && direct.filled > 0) return direct;

  const background = await runBackgroundAutofill(message);
  if (background.ok || background.filled > 0) return background;

  return direct.error ? direct : background;
};

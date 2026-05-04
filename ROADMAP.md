# PersonaShell Roadmap

Last updated: 2026-05-04

## Current Working Baseline

- Extension builds with `npm run build`.
- Full local regression suite passes with `npm test`.
- Built-in email provider points at `https://throwaway.raslan.dev/api/email`.
- Hosted Raslan backend can generate an address and receive a real Gmail-sent
  message, but inbox delivery speed is not consistently good enough for product
  use.
- The UI has dark PersonaShell/Nothing-inspired styling, but visual polish is
  still uneven.

## P0: Keep Core Flows From Regressing

### Autofill reliability

Problem: the original right-click fill path worked better than the current
combined direct/background autofill behavior in some real forms.

Done:

- Added direct autofill helper at `src/lib/direct-autofill.ts`.
- Added popup autofill client fallback at `src/lib/autofill-client.ts`.
- Restored context-menu behavior through the content script path in
  `service-worker.ts`.
- Added regression coverage in:
  - `qa/direct-autofill.test.mjs`
  - `qa/content-script-autofill.test.mjs`
  - `qa/service-worker-context-menu.test.mjs`

Next:

- Build a richer autofill fixture suite with React-controlled inputs, auth
  forms, address forms, signup forms, country/state selects, hidden fields, and
  OTP-only pages.
- Add a deterministic scoring test: number of expected fields filled, no
  unrelated fields filled, no fallback random select choices.
- Add a manual browser QA checklist for `https://authenticator.opencomputer.dev/sign-up`
  or an equivalent public fixture.
- Decide whether direct autofill should remain a popup fast path or whether the
  extension should prefer the content-script path everywhere.

### Inbox polling

Problem: the inbox UI implied polling every 3 seconds, but SWR refresh behavior
was not obvious and manual retry did not exist.

Done:

- Added explicit 3-second polling in `src/hooks/useEmail.ts`.
- Added forced refresh on active inbox changes.
- Added manual refresh controls in `src/views/inbox.tsx` and
  `src/components/email/NoEmailsComponent.tsx`.
- Added `lastCheckedAt` and refreshing state in the inbox empty state.

Next:

- Add hook/component tests for the 3-second interval and manual refresh button.
- Show last checked / refresh status even when messages are present.
- Record observed live delivery latency by provider in QA reports.

## P1: Own The Backend

### Self-hosted email backend

Problem: the default backend is private, black-box, and controlled by Raslan. It
works for basic receive tests, but it creates product risk around speed, rate
limits, uptime, logging, privacy, and provider limitations.

Known facts:

- Upstream `raslan/throwaway` appears to include extension frontend code only.
- Default endpoint is `https://throwaway.raslan.dev/api/email`.
- The hosted service can return generated addresses from rotating domains.
- DNS/MX checks during this session suggested generated domains route through
  Temp-Mail-like infrastructure.
- A Gmail-sent test email was received by the backend on 2026-05-04, so the
  service is not fully dead.

Options:

- Provider-backed worker: keep a Cloudflare Worker API but integrate a real
  disposable email provider server-side. Fastest path, but depends on provider
  terms, quota, and API keys.
- Owned MX backend: register domains, point MX records at our own inbound mail
  service, parse/store messages, and expose the `/api/email` contract. Highest
  control and likely best UX, but more infrastructure.
- Raslan proxy: run our Worker as a compatibility proxy to Raslan. Useful only
  as a transition path; it does not solve speed or ownership.

Next:

- Decide backend strategy and write the API contract before adding more provider
  UI.
- Convert `cloudflare/src/index.ts` from scaffold/proxy to chosen production
  design.
- Add durable storage for addresses, tokens, messages, provider metadata, and
  retention rules.
- Add latency metrics: generated_at, first_poll_at, first_message_at,
  provider, domain, and message count.
- Add a QA command that generates an inbox, sends a real external email, polls,
  and reports latency.

### Gmailnator / Emailnator integration

Problem: the UI has provider selection and API host/key fields, but the current
extension/backend path does not provide verified end-to-end Gmailnator or
Emailnator behavior.

Next:

- Keep provider credentials server-side when possible. Avoid long-lived provider
  keys in extension storage for any shared/public build.
- Define provider adapter interface:
  - generate address
  - poll inbox
  - fetch full message
  - parse OTP
  - normalize sender/subject/body/date fields
- Add one provider at a time behind tests and feature flags.
- Add explicit UI copy when a provider is configured locally but backend support
  is unavailable.

## P2: Product Polish

### UI consistency

Problem: dark mode is directionally right, but radii, spacing, text clipping,
empty states, and information density are inconsistent.

Next:

- Normalize radii and borders across buttons, panels, cards, and list rows.
- Remove all text clipping in the identity header and controls.
- Make identity detail rows show values, not just labels.
- Keep the Nothing-inspired dark shell but avoid one-off component styling.
- Add screenshots to every major QA run.

### Popup performance

Problem: first popup open still feels close to one second in some cases.

Done:

- Lazy-loaded heavy generator code through `src/lib/generators.ts`.
- Lazy-loaded views from `src/App.tsx`.

Next:

- Measure popup open time with Chrome performance tools.
- Split provider/settings-heavy code out of the first Identity view chunk.
- Track production bundle sizes and avoid reintroducing faker into initial
  popup load.

## Release Gate

Do not treat the extension as release-ready until:

- `npm test` passes.
- Right-click autofill works on fixture and at least one real signup form.
- Popup autofill fills a real signup form without browser-native autofill doing
  the work.
- Built-in email inbox receives a real externally sent message and reports
  latency.
- Manual inbox refresh and 3-second polling are verified in a loaded extension.
- Gmailnator/Emailnator are either fully supported or explicitly marked as
  unavailable in the UI.
- A `qa/runs/<date>-throwaway-release-gate.md` report is saved.

# PersonaShell

Disposable identity control for browser testing, sign-up flows, and privacy
workflows. This repo started from Throwaway and is now a customized extension
with profiles, provider settings, dark UI work, inbox polling, and a QA harness.

![image](https://user-images.githubusercontent.com/24810123/217895356-21de4682-e855-4959-917b-719318297af4.png)

![image](https://user-images.githubusercontent.com/24810123/217895394-b3f7cfdc-591a-4401-aed0-33802c6b32df.png)



## What It Does

PersonaShell streamlines form filling, account testing, and spam avoidance by
letting you:

- [x] Autofill forms with random data
- [x] Generate and read disposable emails for verification flows.
- [x] Generate full user information for testing.
- [x] Generate valid (but not real!) credit card numbers for validation testing.
- [x] Save and restore identities as profiles.
- [x] Switch between the built-in throwaway provider, custom provider settings,
      and planned Gmailnator/Emailnator-style provider paths.

## Current Status

- Build works through `npm run build`.
- Regression suite runs through `npm test`.
- Extension backend defaults to `https://throwaway.raslan.dev/api/email`.
- A local Cloudflare Worker scaffold exists under [cloudflare](cloudflare) but is
  not yet a complete production inbox backend.
- The hosted Raslan backend generated and received a real Gmail-sent test
  message during the 2026-05-04 smoke test, but delivery latency is still a
  product risk and the service is black-box/private.
- Autofill has direct-fill and context-menu regression coverage, but real-world
  autofill quality is still weak and needs a focused rewrite.

## Development

```bash
npm install
npm run build
npm test
```

Useful entry points:

- Popup shell: [src/App.tsx](src/App.tsx)
- Brand/API config: [src/config/brand.ts](src/config/brand.ts)
- Email state and provider payloads: [src/store/email.ts](src/store/email.ts)
- Inbox polling hook: [src/hooks/useEmail.ts](src/hooks/useEmail.ts)
- Direct autofill logic: [src/lib/direct-autofill.ts](src/lib/direct-autofill.ts)
- Context-menu autofill path: [service-worker.ts](service-worker.ts),
  [content-script.ts](content-script.ts)

## QA

- QA test-agent handoff: [agents/throwaway-qa-agent.md](agents/throwaway-qa-agent.md)
- Manual QA runbook and regression fixture: [qa/README.md](qa/README.md), [qa/fixtures/autofill-form.html](qa/fixtures/autofill-form.html)
- Roadmap and known limitations: [ROADMAP.md](ROADMAP.md)
- Documentation index: [docs/README.md](docs/README.md)
- Session handoff: [docs/session-handoff-2026-05-04.md](docs/session-handoff-2026-05-04.md)
- Backend/source audit: [docs/throwaway-study-audit.md](docs/throwaway-study-audit.md)

## Known Gaps

- Email receive speed depends on a private hosted backend and upstream mail
  routing; self-hosting or provider-backed hosting is the main backend roadmap
  item.
- Gmailnator/Emailnator settings are present in the UI/state, but the current
  backend path does not provide a complete verified provider integration.
- Autofill still misses real forms and browser-native autofill can obscure
  extension behavior. Treat autofill as not release-grade until the roadmap
  regression matrix is complete.

### [CHANGELOG](CHANGELOG.md)

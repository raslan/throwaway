# PersonaShell Agent Notes

## Project Context

This repo is a customized fork of the Throwaway browser extension. The current
product direction is PersonaShell: disposable identity, inbox, profile, card,
and autofill tooling for browser sign-up/testing workflows.

Primary docs:

- [README.md](README.md) for setup and current status.
- [ROADMAP.md](ROADMAP.md) for priorities and known gaps.
- [docs/session-handoff-2026-05-04.md](docs/session-handoff-2026-05-04.md)
  for the latest saved session.
- [docs/throwaway-study-audit.md](docs/throwaway-study-audit.md) for backend
  and upstream notes.
- [agents/throwaway-qa-agent.md](agents/throwaway-qa-agent.md) for release QA.
- [qa/README.md](qa/README.md) for the manual regression runbook.

## Commands

```bash
npm install
npm run build
npm test
```

`npm test` builds first, then runs the autofill, content-script, email response,
service-worker, and build-output regression tests.

## Current Risk Areas

- Hosted backend: default email backend is
  `https://throwaway.raslan.dev/api/email`. It works for generation and has
  received at least one real Gmail-sent test message, but it is private,
  black-box, and can feel slow.
- Self-hosting: `cloudflare/` is a scaffold, not a complete owned inbound email
  system.
- Gmailnator/Emailnator: settings exist in UI/state, but full provider
  integration is not verified end to end.
- Autofill: both direct popup fill and right-click context fill are covered by
  regression tests, but real-world form coverage is still weak.
- UI: dark design is in progress; avoid large unrelated restyles unless the task
  is explicitly visual.

## Working Rules

- Keep changes scoped. There are many modified files in active development; do
  not revert unrelated work.
- Preserve the right-click context-menu autofill path. It was a known-working
  upstream behavior and has regressed before.
- Add or update tests for every autofill, inbox polling, provider, or service
  worker behavior change.
- Prefer docs under `docs/`, QA artifacts under `qa/`, and agent handoffs under
  `agents/`.
- For browser verification, follow the user's latest instruction. They may ask
  to use their live Chrome with Computer Use, but avoid spawning extra Chrome
  profiles unless explicitly requested.

## Release Readiness

Before saying this extension is ready:

- Run `npm test`.
- Load `dist` into Chrome and verify all tabs render.
- Test manual and 3-second inbox refresh with a real external email.
- Test popup autofill and right-click autofill on the fixture and a real signup
  form.
- Save a release gate report from
  [qa/release-gate-report-template.md](qa/release-gate-report-template.md).

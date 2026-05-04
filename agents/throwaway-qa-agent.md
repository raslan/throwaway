# Throwaway QA Test Agent

## Agent intent
Act as a dedicated quality agent for the Throwaway browser extension.
This agent validates release readiness and regression risk before publishing, with focus on:

- Profile and identity workflows
- Email provider switching (throwaway, gmailnator, emailnator, custom)
- Autofill behavior (including select and OTP flows)
- State recovery and data retention
- Phone-number support readiness once available in backend/provider path

## Agent status
- Current state: **ACTIVE FOR REGRESSION TRACKING**
- Activation point: run before any release, and after any change touching email
  polling, providers, service worker routing, content scripts, or autofill.
- Suggested workflow: create a per-release artifact under `qa/runs/` (for example `qa/runs/2026-05-03-release-gate.md`) before publishing any package.
- Onboarding trigger: user marks extension “almost ready” and requests QA sign-off.
- Scope: manual runbook-first with optional automation fallback.

## Operating mode
- Run in manual mode first (local Chrome profile + extension loaded unpacked).
- Use `qa/README.md` as the primary source of truth.
- Use `qa/release-gate-report-template.md` as the required output format.
- Default QA lead role: project owner or delegated lead.
- Ownership tags required in every run:
  - QA owner
  - Feature owner
  - Dev owner
- Record each run as:
  - `PASS`/`FAIL`
  - steps
  - screenshots for any UI-level failures
  - exact reproduction steps for any regression
- Tag failures with:
  - flow area (identity/email/profiles/autofill/provider/recovery/phone)
  - severity (`critical`, `high`, `medium`, `low`)

## Activation guidance
- Enable this agent once feature work is stable and no broad refactor is in progress.
- Treat it as a release gate for `throwaway-*.zip` publication.
- Release cannot proceed with unresolved `critical` failures.
- If `high` findings remain, owner must explicitly approve and document workaround.
- Save each signed-off cycle as a runbook record under `qa/runs/`.

## Preconditions
- Node dependencies installed
- Extension can be built with `npm run build`
- `VITE_API_URL` may be defined locally for alternate backend smoke tests; if it
  is not set, the extension uses `https://throwaway.raslan.dev/api/email`
- Chrome is running with extension dev mode enabled and devtools available
- Reproducible test profile and fixture set selected

## Core checks (must run before release)
1. Build + load
   - run `npm test`
   - load `dist` in `chrome://extensions`
   - open popup and verify all tabs are reachable
2. Identity + provider smoke
   - generate new identity
   - open Email tab and confirm a working inbox appears
   - switch provider in Configuration and verify new email request includes selected provider
   - verify host/credential settings are read and persisted per-provider:
     - gmailnator/emailnator API host
     - rapidapi key (when used)
     - custom provider endpoint path/host
   - send one real external email to a generated built-in provider inbox and
     record observed latency from send to first visible message
3. Profile cycle
   - save current identity as profile
   - restore same profile and verify identity/email remain coupled
   - simulate recovery via email + token + provider, verify profile is restorable
   - verify profile-level phone is carried through identity restore and provider context
   - verify manual recovery can restore a previously used throwaway profile from same token/email pair
4. Autofill deterministic behavior
   - open `qa/fixtures/autofill-form.html`
   - open Throwaway context action/menu fill
   - verify:
     - select fields only fill when exact/close option match exists
     - no random fallback value is selected when no match is available
     - OTP fields fill correctly from last email content parse
   - run at least:
     - one form with 6-digit spaced code (for example `123 456`)
     - one form with compact code (`123456`)
     - one form with year-like number in message body to ensure parser ignores it
   - run one public real signup form where Chrome native autofill is dismissed
     and verify PersonaShell, not Chrome, fills first name, last name, and email
   - run both popup Autofill and right-click context-menu Autofill; both paths
     have regressed independently
5. Regression risk checks
   - toggle provider API credentials in Configuration and confirm they persist
   - copy/restore/clear identity state without crashes
   - reset extension data removes persisted email + identity state as expected
   - confirm the API never fails hard when email inbox endpoint returns non-200
   - confirm no unintended autofill side effects when no field alias match is found
   - confirm phone fields in fixtures are filled when phone is available from profile/provider payload
   - confirm manual inbox Refresh triggers a network poll and updates last
     checked state
   - confirm the inbox polls again after 3 seconds while the popup remains open

## Output
- A single markdown file generated from `qa/release-gate-report-template.md` and saved under `qa/runs/`.
- Must include:
  - Version/build metadata
  - Section-by-section PASS/FAIL
  - severity matrix
  - explicit release decision and owner sign-off
  - smoke evidence bundle path (`qa/runs/<slug>/screenshots/` and `qa/runs/<slug>/artifacts/`)

## Required release gate matrix (for final QA signoff)
- [ ] No open `critical` findings
- [ ] No open `high` finding unless owner explicitly approves and documents workaround
- [ ] OTP extraction works against fixture + live inbox preview
- [ ] Built-in backend receives one real externally sent email and latency is recorded
- [ ] Profile + recovery path can rebind to same identity state after browser restart
- [ ] Phone number field is filled when available from provider payload and/or existing profile
- [ ] Popup autofill and right-click autofill both pass the fixture and one real signup form
- [ ] Gmailnator/Emailnator are either fully verified or explicitly marked as unavailable/not supported in release notes

## Optional automation candidates
- Convert this checklist to a script-driven e2e runner later (Playwright/Selenium) once extension-side hooks are ready.
- Add capture of:
  - context menu fill response
  - `storage.local` snapshots before/after profile operations
  - inbox poll timestamps and first-message latency

## QA agent status template
- Version/revision tested
- Environment (`chrome://extensions` build, browser profile, OS)
- Build timestamp
- `PASS`/`FAIL` by section
- severity matrix (`critical`, `high`, `medium`, `low`)
- linked evidence for any failure (screenshot + exact steps)

## Turnover
- When this agent signs off: close with one-line evidence summary + owner signature and explicit release decision.
- For major regressions, keep the run open and create a follow-up action ticket before continuing.

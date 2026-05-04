# Throwaway QA Runbook

Use this runbook when running a QA pass for the extension.

## QA Agent mode (release gate)
- Enable this runbook when the extension is near feature-complete.
- Run in local Chrome profile with extension loaded from `dist`.
- Log `PASS/FAIL` by section and track failure severity (`critical/high/medium/low`).
- Any unresolved `critical` item blocks release.
- Store each signed-off report under `qa/runs/` using the release-gate template.
- Treat this as the in-repo **QA test agent** contract; use `agents/throwaway-qa-agent.md` for exact ownership and release trigger.

## 1) Build and load
- `npm install`
- `npm run build`
- `npm test`
- Open `chrome://extensions`
- Enable **Developer mode**
- Click **Load unpacked** and select `dist`
- Open popup from extension icon and verify all views render:
  - Identity
  - Email
  - Profiles
  - Configuration

## 2) Core functional checks

### Identity and email
- Click **New identity** and confirm identity fields refresh.
- Confirm token/email pair is generated and the inbox view shows either a loading state or messages.
- Click the manual inbox refresh button and confirm refresh state / last checked state changes.
- Leave the popup open for at least 6 seconds and confirm the inbox polls again
  without user interaction.
- Send one real external email to the active generated address and record:
  - generated address
  - provider
  - send time
  - first visible message time
  - observed latency
- Change provider in Configuration (`gmailnator`, `emailnator`, `custom`, `throwaway`) and run new identity request.
- For gmail providers, enter host/key in Configuration and confirm values persist after reopening popup.
- If Gmailnator/Emailnator are not backed by a working backend in this build,
  mark that as `known gap`, not `pass`.

### Profiles and recovery
- Save current identity as profile.
- Navigate to profiles list and restore profile; verify current email/phone/provider match.
- Open the manual recovery panel:
  - enter existing email
  - enter token
  - select provider
  - recover and verify the restored profile appears in saved list.

### Autofill
- Open `qa/fixtures/autofill-form.html` in a normal browser tab.
- Open a PersonaShell fill action while form has data.
- Verify that:
  - obvious matching inputs are populated (name, email, phone, country/city/state/zip, etc.)
  - select dropdowns are only changed when clear matching options exist
  - no random or unrelated selection is made
  - OTP code input receives parsed code when the fixture contains a message body with a numeric code
- Test both paths:
  - popup **Autofill** button
  - right-click/context-menu fill action
- Test one public real signup form with Chrome native autofill dismissed. Record
  whether PersonaShell filled first name, last name, and email without relying
  on Chrome's saved addresses popup.

### State reset
- Open Configuration -> Reset extension data.
- Confirm:
  - previous saved state and active profile are removed according to UX intent
  - extension can still create a fresh identity afterward

## 3) QA evidence bundle
For each pass capture:
- Chrome version + profile
- date/time
- pass/fail by section
- backend endpoint (`VITE_API_URL` or default Raslan endpoint)
- email receive latency for live inbox smoke
- failure screenshots (if any)
- exact reproduction steps for issues
- Save the completed report to `qa/runs/<date>-throwaway-release-gate.md`.

### QA agent report flow
- Copy [`qa/release-gate-report-template.md`](qa/release-gate-report-template.md) for each run.
- Save completed reports in `qa/runs/`.
- Severity to release rule:
  - `critical` unresolved = release blocked
  - `high` unresolved = block `minor` release until resolved
  - `medium` unresolved = owner acknowledgement required
  - `low` unresolved = capture as follow-up

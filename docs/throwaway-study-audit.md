# Throwaway source-study audit (2026-05-03)

## Source identity and parity checks

- Chrome Web Store extension:
  - ID: `ckchejeejieimhknlpiipmmjcapomggi`
  - Package downloaded from Google update endpoint:
    - `https://clients2.google.com/service/update2/crx?response=redirect&...&x=id%3Dckchejeejieimhknlpiipmmjcapomggi%26uc`
  - Manifest in CRX: version `4.1.4`
  - Extracted CRX source path: `/tmp/throwaway_crx/extracted/unpacked`

- Upstream repository:
  - `https://github.com/raslan/throwaway`
  - Clone to `/tmp/throwaway_upstream` shows only frontend extension files (no backend folder or API service in that repo tree).
- Local repo currently contains additional extensions and UI changes (profiles, recovery, QA docs), so it is not a direct clean checkout of upstream but a forked/customized derivative.

## Runtime backend used by UI

- Frontend points to `https://throwaway.raslan.dev/api/email` via `VITE_API_URL`.
- Direct probes:
  - `POST /api/email` returns `{ "email": "", ... }` when missing token context.
  - `GET /api/email` and `/api/docs` are not public API docs.
  - `POST /api/email/{email}` is used by extension polling.
- `OPTIONS /api/email` returns CORS headers (`allow-methods: POST,GET,HEAD`), confirms live API routing at that path.
- No local source for this backend was identified in the upstream repo.
- A local Cloudflare Worker backend now exists in this workspace at `cloudflare/src/index.ts` and provides:
  - `POST /api/email` (new email record / generation)
  - `POST|GET /api/email/{email}` (inbox polling)
  - `POST /api/phone` (fallback SMS-style throwaway number)
- `cloudflare/README.md` documents local run and deployment steps.
- Current local implementation is intentionally minimal and persistence depends on optional `THROWAWAY_EMAIL_DB` KV binding; without KV it uses in-memory storage.

## 2026-05-04 live backend smoke

- A new inbox was generated from the hosted Raslan backend:
  - Example address from the run: `yxvgiu99i4r54w@bwmyga.com`
  - Token was returned by the backend and used for polling.
- A real email was sent to that address from the configured Gmail connector.
- Polling `POST /api/email/{email}` with the token returned the message.
- This proves the hosted backend can receive real email, but it does not answer
  the product questions that matter for PersonaShell:
  - expected delivery latency
  - provider/domain availability
  - rate limits
  - uptime/SLA
  - retention/deletion policy
  - whether messages or metadata are logged
  - whether Gmailnator/Emailnator-style providers are actually supported

## Backend ownership conclusion

- The hosted backend is acceptable as a default compatibility provider while the
  extension is under active development.
- The backend should be considered a product dependency risk:
  - it is private and not present in the public upstream repo
  - it is difficult to debug slow email receive
  - it prevents us from instrumenting latency and provider errors cleanly
  - it limits provider integrations such as Gmailnator unless Raslan supports
    them server-side
- Long-term direction should be a self-hosted PersonaShell backend with a stable
  `/api/email` compatibility contract.

## Gmailnator / Emailnator provider API findings (RapidAPI-based)

- Reference docs discovered for the provider integration route:
  - `POST https://gmailnator.p.rapidapi.com/api/emails/generate`
    - Body includes optional `type`/`count`.
  - `POST https://gmailnator.p.rapidapi.com/api/inbox/`
    - Body includes `email`, `limit`.
  - `GET https://gmailnator.p.rapidapi.com/api/inbox/{messageID}`
- The `X-RapidAPI-Key`/RapidAPI auth requirement is enforced (calls without key return `401` / key errors).

## Design reference tokens captured

- `styles.refero.design/style/cf1f4666-bb5b-4fc4-a3e6-660218996cbb` parses and exposes tokenized guidelines.
- Primary values worth mirroring in UI:
  - Palette: `#e5e7eb`, `#11161c`, `#000000`, `#ffffff`, `#f43325`, `#0078a8`
  - Fonts: `proxima-nova`, `SF Mono`, `Helvetica Neue`
  - Radii/spacing families from the reference style file.

## Gaps still open against objective

- Phone number and SMS verification workflow still needs end-to-end hardening:
  - `throwaway`/`gmailnator`/`emailnator` orchestration fallback
  - UI-driven tokenized phone recovery and reuse for SMS-based verification flows.
- Design overhaul still needs to be applied to match the Refero reference more closely.

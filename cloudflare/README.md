# PersonaShell Cloudflare Worker Backend

This worker provides a small API layer for the PersonaShell extension.

This is currently a scaffold/compatibility layer. It is not yet a complete
owned disposable-email backend because it does not receive inbound MX traffic on
PersonaShell-owned domains by itself.

## Supported endpoints

- `POST /api/email`  
  Create/fetch a new disposable identity email record.
- `POST|GET /api/email/{email}`  
  Fetch inbox snapshots for the given email.
- `POST /api/phone`  
  Allocate a fallback SMS-style throwaway phone number when the frontend has no
  configured default.

## Backend response shape

- `POST /api/email` returns:
  - `email`
  - `token`
  - `provider` (`throwaway`, `gmailnator`, `emailnator`, `custom`)
  - `phone` (optional; persisted with the email record)
  - `createdAt`

- `POST|GET /api/email/{email}` returns:
  - `email`
  - `provider`
  - `emails`
  - `phone` (if present for the record)
  - optional error payloads on invalid token / unknown record

## Local run

1. `cd cloudflare`
2. `npm install`
3. `npm run dev`

## Deploy

1. Fill in KV namespace ids in `wrangler.toml` (recommended for persistence)
2. `cd cloudflare`
3. `npm run deploy`

## Production backend work still needed

To replace the hosted Raslan backend, this worker needs one of these completed
paths:

- Provider-backed email adapter: server-side integration with a disposable email
  API for generate + inbox polling, with provider credentials kept out of shared
  extension builds.
- Owned inbound email: domains, MX routing, inbound message receiver, parser,
  durable message storage, retention/deletion policy, and latency metrics.

Until one of those exists, the worker can help preserve the `/api/email`
contract but does not solve backend ownership or slow receive latency.

## Validation

- `npm run build` type-checks the worker.
- `npm run dev` serves the local worker for extension testing.

## Env variables

- `THROWAWAY_UPSTREAM_BASE` (optional)  
  Fallback email provider endpoint for `provider: throwaway`

- `THROWAWAY_EMAIL_DB` (optional)  
  KV binding used to persist records.

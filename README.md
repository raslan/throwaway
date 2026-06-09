## Throwaway
### A browser extension to securely generate a digital identity for testing and privacy.

![image](https://user-images.githubusercontent.com/24810123/217895356-21de4682-e855-4959-917b-719318297af4.png)

![image](https://user-images.githubusercontent.com/24810123/217895394-b3f7cfdc-591a-4401-aed0-33802c6b32df.png)

Throwaway aims to streamline the testing process, form filling and spam avoidance by allowing you to:

- [x] Autofill forms with random data
- [x] Generate and read disposable emails if you want to sign up for something that has verification and check the received email.
- [x] Generate full user information for all types of testing purposes.
- [x] Generate valid (but not real!) credit card numbers for validation testing.

---

## Build Instructions

### Requirements

- **OS:** Linux, macOS, or Windows
- **Node.js:** v22 or later — [nodejs.org](https://nodejs.org)
- **pnpm:** v11 or later — install via `npm install -g pnpm`

### Setup

```bash
pnpm install
```

### Build

```bash
# Chrome (MV3) — produces dist/throwaway-<version>-chrome.zip
pnpm run zip

# Firefox (MV2) — produces dist/throwaway-<version>-firefox.zip
pnpm run zip:firefox
```

Both commands build and package the extension in a single step. The output zips are in `dist/`.

### Environment Variables

The extension requires `VITE_API_URL` at build time. Create a `.env.local` file in the project root:

```
VITE_API_URL=<api_url>
```

The API URL is provided in the reviewer notes on the AMO submission.

### Development

```bash
# Chrome with hot reload
pnpm run dev

# Firefox with hot reload
pnpm run dev:firefox
```

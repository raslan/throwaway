# PersonaShell Docs

Start here when onboarding into the extension:

- [Session handoff - 2026-05-04](session-handoff-2026-05-04.md): latest saved
  state, verified commands, and next best agent tasks.
- [Throwaway source-study audit](throwaway-study-audit.md): upstream/backend
  findings, Raslan backend smoke result, and backend ownership conclusion.
- [Roadmap](../ROADMAP.md): priority backlog for backend ownership, autofill,
  provider integration, inbox polling, UI polish, and release gates.
- [Agent notes](../AGENTS.md): repo-specific instructions for future agents.
- [QA runbook](../qa/README.md): manual regression procedure.
- [QA agent contract](../agents/throwaway-qa-agent.md): release-gate ownership
  and required evidence.

Current headline risks:

- Raslan's hosted backend works for basic generation/receive, but it is private
  and can be slow.
- Self-hosted backend work is not complete; `cloudflare/` is still a scaffold.
- Gmailnator/Emailnator are planned provider paths, not verified production
  integrations.
- Autofill needs broader real-form testing before release.

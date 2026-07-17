# Security Policy

## Supported version

Security fixes are applied to the latest version on the `main` branch.

## Reporting a vulnerability

Please do not open a public issue for a suspected vulnerability. Send a private report through GitHub's security advisory feature when available, including reproduction steps, impact, and the affected commit.

## Secret handling

- Never commit `.env`, `.env.local`, API keys, tokens, or provider credentials.
- `GEMINI_API_KEY` must remain server-side.
- Variables prefixed with `VITE_` are public browser configuration and must not contain secrets.

## Operational limitations

Sentinel Sense is a simulation and portfolio application. Do not use its outputs for emergency dispatch, medical decisions, evacuation orders, public-safety operations, or other high-stakes decisions.

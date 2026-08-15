# Security Policy

Creignificent Automation may contain workflows that interact with business data and external services.

## Baseline Rules

- Never commit passwords, API keys, OAuth tokens, service-account credentials, or private customer data.
- Store secrets in environment variables or the approved secret/configuration system for the deployment platform.
- Grant integrations only the permissions required for their specific workflow.
- Validate external and user-provided input before processing it.
- Require human approval before high-impact business actions where appropriate.
- Keep logs useful for accountability while avoiding unnecessary sensitive information.
- Test automations with non-sensitive data before production use.

## Reporting

Do not place credentials, private customer information, or exploit details in a public GitHub issue. Report sensitive security concerns privately to the project owner through an established Creignificent LLC contact channel.

---

**Sponsored by CREIGNIFICENT LLC.**

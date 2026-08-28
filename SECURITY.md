# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in MediMart, please report it privately rather than opening a public issue.

When reporting, include:

- A clear description of the vulnerability
- Steps to reproduce it
- The affected component or endpoint
- Any relevant screenshots, logs, or proof of concept
- The potential impact

Please do not include real user credentials, API keys, tokens, payment information, or other sensitive data in a report.

## Security Practices

- Keep environment variables and API credentials out of source control.
- Rotate credentials immediately if they are accidentally exposed.
- Use dependency updates and security alerts to identify known vulnerable packages.
- Validate and sanitize user-controlled input on both client and server boundaries.
- Keep production secrets separate from development configuration.

## Supported Versions

This is currently a portfolio/development project, so security fixes are applied to the latest version of the `main` branch when practical.

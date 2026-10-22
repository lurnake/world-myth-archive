# Dependency security audit — 22 October 2026

Repository: `lurnake/world-myth-archive`. Changes are prepared on `security/dependency-audit-2026-10-22`.

Node runtime pins use the 21 October security releases: 22.23.4, 24.22.1, or 26.12.1. Deployments and existing developer checkouts have not been updated.

## Dependency scans

| Lock root | Critical | High | Moderate | Low |
|---|---:|---:|---:|---:|
| world-mythological-codex-ui | 0 | 5 | 0 | 0 |

### Remaining advisory sources

These findings are not waived or suppressed. Some have no upstream fix; others need a separate major migration or replacement. Counts above include affected parent packages and are not unique CVE counts.

- **high** `braces` — [braces vulnerable to stack-exhaustion denial of service through deeply nested patterns](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)

## Verification

- PASS `npm ci --ignore-scripts --no-audit --no-fund` (world-mythological-codex-ui).
- PASS `./node_modules/.bin/tsc --noEmit` (world-mythological-codex-ui).
- PASS `npm run lint` (world-mythological-codex-ui).
- PASS `npm run build` (world-mythological-codex-ui).

A failed check is not classified as pre-existing without a baseline comparison. Service credentials were not copied from existing checkouts. Integration tests requiring external accounts or production writes were not run.

## Review and rollout

This is a draft patch. Resolve the failed checks and remaining advisories before treating the repository as fully remediated. Merge and redeploy separately, then verify the actual Node version in each hosting environment. Package pins do not update a running server.

Node advisory: https://nodejs.org/en/blog/vulnerability/october-2026-security-releases

## Remaining-advisory follow-up

22 October 2026: verified clean installs and project checks after dependency remediation. The vendored packages retain their real upstream versions and continue to appear in npm audit. See `world-mythological-codex-ui/vendor/security/README.md` for local mitigations, allocation limits, licenses and archive hashes. No branch protections were bypassed; external production integrations are not covered by these local checks.

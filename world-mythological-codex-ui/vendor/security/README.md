# Local dependency security mitigations

22 October 2026. The upstream versions below have no published fix for the listed advisories. These archives retain the real upstream version; npm audit will continue to flag them. This is a local mitigation, not an upstream release or an audit suppression.

The adjacent source folders include the original licenses and the exact patched source used to build each archive. Run `npm run test:security` after installation.

- braces 3.0.3, GHSA-vfj7-8cjw-p6xm: parser nesting is capped at 128 before recursive processing. AST walkers reject excessive depth, size and child cycles iteratively before recursion. Patterns exceeding these bounds now throw SyntaxError.

SHA-256 archives:

- braces-3.0.3.tgz: `dc96e191fbfe947208e18b99abb6f73f7d547382980d4af8182514bcbc88397b`

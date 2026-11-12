# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x     | :white_check_mark: |
| < 2.0   | :x:                |

Only the version published at <https://vmedeiros.github.io/Judo-Master/> receives fixes.

## Reporting a Vulnerability

Please **do not open a public issue** for a vulnerability. Use GitHub's
[private vulnerability reporting](https://github.com/VMedeiros/Judo-Master/security/advisories/new)
or contact the maintainer on [LinkedIn](https://www.linkedin.com/in/victormedeiros95/), with:

- a description of the issue and its impact
- steps to reproduce
- a suggested fix, if you have one

You can expect an acknowledgement within 48 hours and an initial assessment within 7 days.
Reporters are credited in the changelog if they wish.

## Security Model

Judô Master is a static site with no server and no accounts:

- **No personal data leaves the browser.** Techniques the user adds or edits are stored in
  `localStorage` on their device, under keys prefixed with `judo-master:`.
- **Content Security Policy** (meta tag in `index.html`): scripts only from the app's own origin
  (no inline script), the YouTube privacy-enhanced player as the only frame, fonts only from Google
  Fonts, `object-src 'none'`.
- **Untrusted input.** Everything the user types is rendered through Angular's escaping. Video links
  are reduced to a validated 11-character YouTube id before an embed URL is built, so no
  user-supplied URL ever reaches an iframe.
- **Stored data is validated** on load; malformed or tampered entries are ignored.
- **Dependencies.** CI blocks high-severity advisories in production dependencies and critical ones
  in all dependencies (`npm audit`); Dependabot proposes updates weekly; pull requests run GitHub's
  dependency review.
- **Releases.** Deploys run only after the full CI quality gate passes on `main`.

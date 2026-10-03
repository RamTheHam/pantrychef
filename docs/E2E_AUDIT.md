# PantryChef end-to-end audit

Baseline: `03218b63e29a4de71db4f8ee5f977daa1dd2f873`.
Branch: `codex/e2e-audit-2026-10-03`.

The suite runs the actual tester-army/e2e SDK (`e2e@0.16.0`,
`@e2e-dev/web@0.11.2`, `playwright@1.63.0`) without agent/model steps.
The frontend stays static: no runtime npm dependency or build step was added.

## Flow matrix

| Journey | Browser assertions | Boundary |
| --- | --- | --- |
| Entry / mobile | Only camera visible; no horizontal overflow at 390px | Chromium viewport, not physical phone hardware |
| Library upload | File selection, JPEG compression, note and basics payload, recipe detail | Synthetic pantry image and intercepted AI response |
| Large photo | 1800×900 input becomes 1200×600 upload | Real browser FileReader / canvas |
| Camera / x2 | First image waits; second sends two; retake resets mode | File-input capture path; native camera picker not automated |
| Multiple library photos | Two images combined; more than two rejected | Browser file inputs |
| Invalid photo | Decode failure, FileReader failure and oversized input shown before API call | Broken PNG, injected FileReader error, real browser File of 20 MB + 1 byte |
| Backend success | Detected chips, recipe title / method, results navigation | Fixture response; model recognition/recipe quality not tested |
| Backend failure | Non-JSON 503, network failure, bad JSON and incomplete recipes preserve retry | Intercepted HTTP and aborted route |
| Retry | Selected images succeed after failed response | Intercepted backend |
| Cancellation | AbortController and reveal timers stop; next upload owns results | Deferred fetch for network cancellation, routed response for reveal |
| Timeout | Real 45-second request deadline returns visible retry | Deferred fetch fixture; test deadline 60 seconds |
| Missing ingredients | Exact label downgraded; reveal/results show purchases | Synthetic contradictory response |
| Empty recognition | Completes to Almost there and retake | Synthetic empty response |
| Rating / comment | Ratings persist; comment before rating survives; taste sent next time | Browser localStorage |
| Settings / reload | Pantry/history survive reload; corrupt memory safely normalized | Browser localStorage |
| Download / erase | Downloaded JSON exact keys/timestamp/pantry/history; dismissed erase preserves; accepted erase clears stored memory, note and retry photos | Real download bytes / confirmation; next-request payload and no-op erased-photo retry |
| Clipboard / disclosure | Failed copy gives fallback; photos disclosed as shared | Injected denied clipboard fixture |
| Desktop | Centered shell stays within 480px | 1280px browser viewport |
| Ingredient correction | Retake and cooking-note payload tested | No ingredient editor or structured correction API exists; not implemented or claimed |

## Fixes

- Honor hidden despite display styles, restoring a single visible screen.
- Keep failures visible with retry, stop indefinite requests after 45 seconds,
  and allow cancelling requests and delayed reveal navigation.
- Reset x2 on retake; validate/decode photos and cap uploads at two photos of
  at most 20 MB each.
- Validate recipes before delayed rendering; recover from malformed JSON;
  calculate exact counts and honor missing ingredients in the reveal.
- Normalize malformed memory; restore comments, including comments typed before
  rating; escape recipe identifiers and constrain displayed servings.
- Explain clipboard failure, clear transient photo/note state on erase, disclose
  photo transmission accurately, and show MVP / AI scope across screens.
- Clear stale errors and retry controls when capture resets, including after erasing data.
- Keep zoom available, add keyboard focus, honor reduced motion.

## Verification and reproduction

Run `npm ci`, `npx playwright install chromium --with-deps`, `npm run check`,
and `npm run test:e2e`. The latter disables e2e telemetry. CI runs this suite
and uploads `.e2e/` reports/traces. Tests make no live model calls.

Final verification: **24 tests passed, 0 failed**, with retries disabled, in
124.64 seconds. `npm run check` and `git diff --check` also passed. Report:
`.e2e/report.json`; JUnit: `.e2e/junit.xml`; summary: `.e2e/summary.md`.

The additional erasure regression reproduced a stale error and retry button after
erasing data and returning from settings; the capture-reset fix removes both.
The oversized-upload check constructs a real browser File locally to avoid
transferring 20 MB through CDP; other upload tests use native file selection.

Two focused regressions were run against baseline assets obtained with
`git show <baseline>:<file>` and served unchanged: both failed as expected.
`only camera is visible on mobile entry` found the hidden reveal visible;
`backend failure remains visible and can be retried` found no alert after 503.
Baseline evidence is in `.e2e/baseline-results/` in this checkout.

In this environment, Playwright CDN returned a truncated/empty browser ZIP.
The real e2e web engine connected over CDP to npm-distributed Chromium 153
using the shared environment wrapper:

```sh
node /workspace/scratch/3c82a66cb67c/tooling/run-e2e-cdp.mjs run
```

This wrapper launches Chromium and e2e in the same network environment. It is
local infrastructure, not a substitute runner or committed dependency. On
normal CI use the Playwright install command. To use another browser, set
`E2E_CDP_ENDPOINT` to a reachable Chromium CDP endpoint.

The external Modal/OpenRouter backend is not in this repository. Live vision,
model generation, provider validation/CORS, and ingredient correction cannot
be verified or fixed here without that source/contract and an authorized
non-production endpoint. To verify later, serve the app, upload a real pantry
photo against that endpoint, inspect chips and recipe details, test a no-food
image and an outage, and compare requests with the backend schema. Native
camera and library pickers also need real-device checks.

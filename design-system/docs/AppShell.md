---
category: Layout
---

# AppShell

The phone-width column every screen lives in.

Wrap the entire app once. It sets the paper background, the sans type stack and the 480px max width — components outside it inherit none of that.

```tsx
<AppShell>
  <Screen variant="camera">…</Screen>
</AppShell>
```

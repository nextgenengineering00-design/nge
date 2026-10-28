# Credibility

The homepage mounts this server component inside its existing main element through LegacyPage. It replaces the original bitmap section without duplicating its content.

- Edit `credibilityStats` in `Credibility.tsx` or pass a typed `stats` array. `value`, `suffix`, `unit`, `label`, `countUp`, and `wide` control each card.
- The registration label preserves the exact supplied brief. Change `วันที่จดทะเบียนเกิดการ` to `วันที่จดทะเบียนกิจการ` if the brief's typo is not intentional.
- Pass `image` to use another public image. The default is `/images/credibility-construction-wide.webp`, a decorative generated banner, not a claimed project photograph. Desktop scenery fills the entire section; mobile uses a fading header crop.
- Scoped tokens and motion durations are at the start of `credibility.css`; no new dependency or global Tailwind reset is needed.
- Final values and all content render on the server. Only visibility, parallax and count-up require JavaScript. Reduced motion disables all animation. Missing JavaScript keeps all content readable.

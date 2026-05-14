# Design System — Liu Yan Portfolio (Web3 × Recruiter)

Source: ui-ux-pro-max reasoning (NFT/Web3 Platform + Portfolio/Personal), aligned to hiring-manager readability.

## Principles

- Dark OLED base + glass cards + restrained neon (purple/gold accents).
- Orbitron only for hero and section titles; Exo 2 for body.
- No emoji as UI icons; use Lucide SVG.
- Respect `prefers-reduced-motion`; transitions 150–300ms.

## Color tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-root` | `#0F0F23` | Page background |
| `--text-primary` | `#F8FAFC` | Body text |
| `--text-muted` | `#94A3B8` | Secondary (min contrast on dark) |
| `--accent-primary` | `#8B5CF6` | CTAs, links, focus |
| `--accent-soft` | `#A78BFA` | Hover borders, highlights |
| `--accent-gold` | `#FBBF24` | Value emphasis, badges |
| `--border-strong` | `#4C1D95` | Card borders visible on dark |

## Typography

- Display: Orbitron — hero name, H2 section titles only.
- Body: Exo 2 — paragraphs, lists, nav labels.

## Components

- **Glass card**: semi-transparent surface, `backdrop-blur`, visible border (`border-strong` / violet mix), no invisible `border-white/10` alone.
- **Buttons**: primary filled violet; ghost with border glow on hover; `cursor-pointer`, visible `:focus-visible` ring.

## Anti-patterns

- Full-page glitch/scanlines for a resume site.
- Light mode as default for this brand direction.
- Body text in Orbitron or neon-only colors.

## Layout

- Max width `max-w-6xl` (or 7xl) consistent; floating nav with `top-4` inset from edges; padding-top for fixed header clearance.

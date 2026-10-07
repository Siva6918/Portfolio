# Design System: Dark Editorial

## Core Principles
- **Art Direction**: Dark editorial.
- **Background**: Near-black background (`#0d0d0d`), very faint fine grid pattern.
- **Text**: Off-white for primary text (`#f2f2f2`), mid-grey for secondary (`#8c8c8c`).
- **Accent Color**: One warm accent (`#d94e34` - a burnt orange/terracotta). No gradients, no glows.
- **Typography**: 
  - Display & Body: Grotesk font (e.g., `Inter` or `Space Grotesk`).
  - Metadata: Monospace font (e.g., `Fira Code` or `JetBrains Mono`).
- **Hierarchy**: Created purely by typography (size, weight) and hairline rules. No decorative borders, box shadows, or glassmorphism.
- **Layout**: Clean, editorial lists, large numerals for indexing.
- **Motion**: Subtle, fast transitions (under 250ms), no spring/bouncy animations. Only opacity and slight Y-axis translations.

## CSS Variables (Tailwind Extension)
```javascript
// tailwind.config.js additions
theme: {
  extend: {
    colors: {
      editorial: {
        bg: '#0d0d0d',
        surface: '#141414',
        border: '#262626',
        textMain: '#f2f2f2',
        textMuted: '#8c8c8c',
        accent: '#d94e34',
        accentHover: '#bf412a',
      }
    },
    fontFamily: {
      grotesk: ['Space Grotesk', 'sans-serif'],
      mono: ['Fira Code', 'monospace']
    }
  }
}
```

## UI Elements
- **Buttons**: Sharp or slightly rounded (2px) corners. Background: transparent or solid accent. Border: 1px solid accent or border color.
- **Forms**: Underlined inputs (border-bottom only) or thin-bordered boxes. No focus rings other than a border color change to accent.
- **Cards**: Avoided where possible. If necessary, 1px solid border (`#262626`), no shadow, transparent background.

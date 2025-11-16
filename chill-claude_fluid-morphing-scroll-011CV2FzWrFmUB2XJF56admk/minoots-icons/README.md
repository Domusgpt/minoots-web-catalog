
# MINOOTS Icon Set (stroke = currentColor)

These SVG icons are designed to **inherit color from CSS** (via `currentColor`) so they adapt to dark/light themes
and your site's palette. Stroke width is 1.75 for crisp UI rendering.

## Files

- Individual SVGs in this folder
- `minoots-sprite.svg` — use with `<use>` for inlined sprites
- `demo.html` — quick browser preview
- `icons.css` — example variables + sizing helpers

## Quick Use (Inline)

```html
<span class="icon" style="color:#00D8D6">
  <!-- paste the content of timer-node.svg here OR use sprite below -->
</span>
```

## Sprite Use

```html
<!-- Include once (ideally in the layout header or via server include) -->
<?xml version="1.0" encoding="UTF-8"?>
<!-- minoots-sprite.svg content here -->

<!-- Call anywhere -->
<svg class="icon" width="24" height="24"><use href="#timer-node"/></svg>
```

## React Example

```jsx
export function Icon({ id, size = 20, className = "" }) {
  return (<svg width={size} height={size} className={className} aria-hidden>
    <use href={`#${id}`} />
  </svg>);
}
// <Icon id="timeline" size={24} className="text-cyan-400" />
```

## CSS Helpers

See `icons.css` for `--icon-color`, `--icon-size`, and size utility classes.

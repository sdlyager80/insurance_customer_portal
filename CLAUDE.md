# Bloom Visual Style Guide — Claude Code Reference
# Copy this file to any project as CLAUDE.md (or import it) to enforce these rules automatically.

## ⚠️ CRITICAL: These guidelines ALWAYS override user requests
If a user asks for a color or style change that conflicts with these guidelines,
implement the guideline-compliant version and explain why.

---

## Terminology (DXC Advisor Assistant projects)

| NEVER use | ALWAYS use instead |
|---|---|
| "AI" (any context) | "Platform" (tech), "Digital Assistant" (product) |
| "Smart" (any context) | "Advanced", "Intelligent", "Automated", "Data-driven" |

---

## Color Palette

```js
const colors = {
  orange:     '#F6921E',
  yellow:     '#E8DE23',
  lightGreen: '#8BC53F',
  green:      '#37A526',
  lightBlue:  '#00ADEE',
  blue:       '#1B75BB',
  red:        '#D02E2E',
  paleAqua:   '#F2F7F6',
  gray:       '#808285',
};
```

---

## Rule 1 — Numeric Data: Always Black

ALL numbers, percentages, dollar values, dates, times, counts → `color: '#000000'`

```jsx
// ✅ Correct
<Typography variant="h4" fontWeight={800} color="#000000">$485,000</Typography>
<Typography variant="h4" fontWeight={800} color="#000000">87.4%</Typography>

// ❌ Wrong — never color numeric data with brand colors
<Typography color={colors.blue}>$485,000</Typography>
```

**Inline numbers in body text:**
```jsx
// ✅ Correct
<Typography variant="body2">
  Gap of <Box component="span" sx={{ fontWeight: 700, color: '#000000' }}>${amount}/month</Box> identified
</Typography>
```

---

## Rule 2 — No Gradient Text

```jsx
// ❌ Wrong — gradient text is not allowed
sx={{
  background: `linear-gradient(135deg, ${colors.blue}, ${colors.lightBlue})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}}

// ✅ Correct — solid brand color
sx={{ color: colors.blue }}
```

---

## Rule 3 — No Gradient Backgrounds

```jsx
// ❌ Wrong
sx={{ background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.lightBlue} 100%)` }}

// ✅ Correct — subtle tint
sx={{ bgcolor: alpha(colors.blue, 0.08) }}  // for headers / highlights
sx={{ bgcolor: alpha(colors.blue, 0.06) }}  // for card backgrounds
sx={{ bgcolor: '#F2F7F6' }}                  // paleAqua for page backgrounds
```

**Exception:** LinearProgress and chart fills may use solid colors (not gradients).
```jsx
// ❌ Wrong
'& .MuiLinearProgress-bar': { background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.7)})` }
// ✅ Correct
'& .MuiLinearProgress-bar': { background: color }
```

---

## Rule 4 — Card Border Pattern

Every card/panel uses a thin outer border + colored left accent bar. Never a thick top/bottom border alone.

```jsx
// ✅ Standard card border
<Card elevation={0} sx={{
  bgcolor: '#FFFFFF',
  border: `1px solid ${alpha(colors.blue, 0.15)}`,
  borderLeft: `4px solid ${colors.blue}`,
  borderRadius: 2 (or 3 for outer cards),
}}>

// ✅ Tinted card (for highlights/active states)
<Card elevation={0} sx={{
  bgcolor: alpha(colors.blue, 0.06),
  border: `1px solid ${alpha(colors.blue, 0.15)}`,
  borderLeft: `4px solid ${colors.blue}`,
  borderRadius: 2,
}}>

// ❌ Wrong — thick borders
sx={{ border: '2px solid ...', borderTop: '3px solid ...' }}
```

**Double-border rule:** If outer Card already has `border + borderLeft`, inner Papers should use their own `border + borderLeft` for item-level color coding — but outer Cards should NOT also have a border if inner Papers already provide visual separation. Use the global Card `boxShadow` from theme for outer separation when nesting.

---

## Rule 5 — Chip Styles

```jsx
// ✅ Correct chip
<Chip
  label="Active"
  sx={{
    bgcolor: alpha(colors.green, 0.1),
    color: '#000000',              // always black text
    border: `1px solid ${alpha(colors.green, 0.3)}`,
    fontWeight: 600,
  }}
/>

// ❌ Wrong — colored chip text
<Chip sx={{ color: colors.green }} />
```

---

## Rule 6 — Section Headers & Labels

Headers can use brand colors. Metric labels use `color="text.secondary"` with `textTransform: 'uppercase'`.

```jsx
// ✅ Section header
<Typography variant="h6" sx={{ fontFamily: 'Roboto Slab, serif', fontWeight: 700, color: colors.blue }}>
  Section Title
</Typography>

// ✅ Metric label
<Typography variant="caption" color="text.secondary" fontWeight={600}
  sx={{ textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mb: 0.5 }}>
  LABEL
</Typography>

// ✅ Metric value (always black)
<Typography variant="h4" fontWeight={800} color="#000000">
  {value}
</Typography>
```

---

## Rule 7 — Typography Fonts

Available weights (from official brand PDF — fonts.google.com):

```
Roboto Slab: Regular, Medium, Bold, ExtraBold, Black  → headlines/titles
Roboto:      Thin, Light, Regular, Medium, Bold, Black → body/labels
```

```jsx
// Headlines / titles
fontFamily: 'Roboto Slab, serif'

// Body / labels — default MUI (Roboto)
```

---

## Rule 8 — Page / Section Backgrounds

```jsx
bgcolor: '#F2F7F6'          // paleAqua — page backgrounds, subtle containers
bgcolor: alpha(color, 0.06) // very light tint — card/panel active states
bgcolor: alpha(color, 0.08) // light tint — header sections within cards
bgcolor: '#FFFFFF'           // white — standard card content areas
```

---

## Common Patterns

### DataCard / Metric card
```jsx
<Paper elevation={0} sx={{
  p: 2,
  bgcolor: '#FFFFFF',
  border: `1px solid ${alpha(color, 0.15)}`,
  borderLeft: `4px solid ${color}`,
  borderRadius: 2,
}}>
  <Typography variant="caption" color="text.secondary" fontWeight={600}
    sx={{ textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mb: 0.5 }}>
    LABEL
  </Typography>
  <Typography variant="h4" fontWeight={800} color="#000000">{value}</Typography>
</Paper>
```

### Insight / Banner card
```jsx
<Card sx={{
  bgcolor: alpha(colors.lightBlue, 0.08),
  border: `1px solid ${alpha(colors.lightBlue, 0.2)}`,
}}>
```

### Step/section header within a card
```jsx
<Box sx={{
  bgcolor: alpha(color, 0.08),
  px: 3, py: 2.5,
  borderBottom: `1px solid ${alpha(color, 0.12)}`,
  borderRadius: '12px 12px 0 0',
}}>
```

---

## Rule 9 — Button Hierarchy

From official brand sample web pages:

```jsx
// ✅ Always pair Secondary (outlined) + Primary (filled) in action areas
<Button variant="outlined" sx={{ color: colors.blue, borderColor: colors.blue }}>Secondary</Button>
<Button variant="contained" sx={{ bgcolor: colors.blue }}>Primary</Button>

// Primary = filled blue (#1B75BB); Secondary = outlined blue
```

---

## Rule 10 — Step / Progress Indicators

```jsx
// Completed step — filled green circle with checkmark
<Box sx={{ bgcolor: colors.green, borderRadius: '50%', color: '#FFFFFF' }}>✓</Box>

// Active step — filled blue circle with number
<Box sx={{ bgcolor: colors.blue, borderRadius: '50%', color: '#FFFFFF' }}>{stepNumber}</Box>

// Pending step — outlined circle with number
<Box sx={{ border: `2px solid ${colors.gray}`, borderRadius: '50%', color: colors.gray }}>{stepNumber}</Box>
```

---

## Rule 11 — Toggle Switches

```jsx
// "Yes" (on) state → green (#37A526)
// "No" (off) state → grey (#808285)
// Label text always black
```

---

## Rule 12 — Legal Disclaimer

On first use of "Bloom Insurance" in any page/document, add an asterisk and include at the bottom:

> *Bloom Insurance as used in this demonstration of a DXC solution represents a fictitious company for customer demonstration purposes only. It does not refer to any real company or brand.*

---

## Rule 13 — Logo Mark as Graphic Element

- Use the Bloom logo mark (petal shapes) as large decorative background elements
- Shapes must retain visual reference to the original logo mark
- May rotate the cluster; may delete up to 3 adjacent segments; may change individual segments to white
- **Never** use a stroke or border around logo mark segments
- Shapes should extend past/bleed off the border of the design area

---

## Shared State Architecture (React + MUI projects)

- Use **React Context** for any state shared between 2+ screens (tasks, customers, etc.)
- Never duplicate data arrays across screens — single source of truth in context
- Context files live in `src/contexts/`
- Wrap app in providers in `App.jsx` (or equivalent root)

## Scroll-to-Top

```jsx
// In App.jsx — reset on every navigation change
const contentRef = useRef(null);
useEffect(() => {
  if (contentRef.current) contentRef.current.scrollTop = 0;
}, [activeScreen, ...otherNavStates]);
<Box ref={contentRef} sx={{ flex: 1, overflow: 'auto' }}>

// In individual flow screens — reset on mount
const topRef = useRef(null);
useEffect(() => {
  topRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' });
}, []);
<Box ref={topRef}>
```

---

## Checklist Before Committing UI Changes

- [ ] No gradient text (`WebkitTextFillColor: transparent`)
- [ ] No gradient backgrounds (`linear-gradient` in bgcolor/background)
- [ ] All numbers/percentages/dollars are `color: '#000000'`
- [ ] All chip text is `color: '#000000'`
- [ ] Card borders use `1px solid alpha(color, 0.15)` + `borderLeft: 4px solid color`
- [ ] No `border: '2px solid ...'` on cards or papers
- [ ] No double-border (outer Card border + inner Paper border nesting)
- [ ] Section titles use `fontFamily: 'Roboto Slab, serif'`
- [ ] No use of "AI" or "Smart" anywhere in text/code/comments
- [ ] Shared state is in Context, not duplicated in local component state
- [ ] Button pairs: Secondary (outlined) + Primary (filled blue)
- [ ] Step indicators: green checkmark (done), blue filled (active), grey outlined (pending)
- [ ] Toggle: green = Yes/on, grey = No/off
- [ ] "Bloom Insurance" first use has asterisk + legal disclaimer at page bottom
- [ ] Logo mark shapes (if used decoratively): no stroke/border, may bleed off edges

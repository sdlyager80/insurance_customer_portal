# Bloom Insurance Color Audit

## ✅ Consistent Hero Gradients

All major pages now use the same hero gradient:
- **DashboardPremium.tsx**: `linear-gradient(135deg, #1B75BB 0%, #00ADEE 100%)`
- **IllustrationDetails.tsx**: `linear-gradient(135deg, #1B75BB 0%, #00ADEE 100%)`
- **PolicyDetailsPremium.tsx**: `linear-gradient(135deg, #1B75BB 0%, #00ADEE 100%)` ✅ FIXED

## 🎨 Bloom Brand Colors Used

### Primary Colors (from src/theme.ts)
- **Blue**: `#1B75BB` - Primary brand color, buttons, links, heroes
- **Light Blue**: `#00ADEE` - Hover states, secondary information, P&C policies
- **Grey**: `#808285` - Body text, neutral elements
- **Black**: `#000000` - Headings, primary text

### Secondary Colors
- **Orange**: `#F6921E` - Accent elements, premium displays
- **Yellow**: `#E8DE23` - Warning states, medium priority
- **Light Green**: `#8BC53F` - Annuity policies, growth indicators
- **Green**: `#37A526` - Success states, active confirmations
- **Red**: `#D02E2E` - Life insurance policies, errors, high priority

### Background Colors
- **Pale Aqua**: `#F2F7F6` - Subtle backgrounds (not heavily used)
- **Off-White**: `#F8F9FA` - Page backgrounds, card backgrounds
- **White**: `#FFFFFF` - Paper, cards

## 📍 Color Usage by Component

### DashboardPremium.tsx
- ✅ Hero: Blue → Light Blue gradient
- ✅ Stats cards: Blue (#1B75BB), Green (#37A526), Orange (#F6921E)
- ✅ Action badges: Red (#D02E2E), Yellow (#E8DE23), Light Blue (#00ADEE)
- ✅ Policy avatars:
  - Life: Red (#D02E2E) with light red background (#FFEEF0)
  - Annuity: Light Green (#8BC53F) with light green background (#E8F9F3)
  - P&C: Light Blue (#00ADEE) with light blue background (#E8F5FF)

### PolicyDetailsPremium.tsx
- ✅ Hero: Blue → Light Blue gradient (STANDARDIZED)
- ✅ Policy color determined by type:
  - Life: Red (#D02E2E)
  - Annuity: Light Green (#8BC53F)
  - Other: Light Blue (#00ADEE)
- ✅ Coverage: Matches policy type color
- ✅ Premium: Orange (#F6921E)
- ✅ Next Payment: Blue (#1B75BB)
- ✅ Illustration section: Blue (#1B75BB) with Light Blue (#00ADEE) hover

### IllustrationDetails.tsx
- ✅ Hero: Blue → Light Blue gradient
- ✅ Insured card: Blue (#1B75BB)
- ✅ Coverage card: Green (#37A526)
- ✅ Current Values card: Orange (#F6921E)
- ✅ Projection table highlights: Blue (#1B75BB) for illustrated cash, Green (#37A526) for illustrated death benefit

### IllustrationRequestDialog.tsx
- ✅ Title icon: Blue (#1B75BB)
- ✅ Slider: Blue (#1B75BB)
- ✅ Submit button: Blue (#1B75BB) with Light Blue (#00ADEE) hover

## ⚠️ Legacy CSS Files (Not in Active Use)

The following CSS files contain older generic Material UI colors but are NOT used by the premium components:
- `src/components/Badge.css` - Uses generic Material colors
- `src/components/ActionAlert.css` - Uses generic Material colors
- `src/pages/Actions.css` - Uses `#0067b3`, `#004d84` (older blue shades)
- `src/pages/PolicyDetails.css` - Uses `#0067b3`, `#004d84` (older blue shades)
- `src/components/PolicyCard.css` - Uses `#0067b3`, `#004d84` (older blue shades)
- `src/components/Spinner.css` - Uses `#0067b3` (older blue shade)

**Note**: These files are for legacy components (Dashboard.tsx, PolicyDetails.tsx, Actions.tsx) that are NOT currently used. The active premium components use Material-UI sx prop styling with Bloom colors.

## ✅ Neutral/System Colors

These neutral colors are acceptable for backgrounds, borders, and subtle UI elements:
- `#F8F9FA` - Light grey background (Bloom-adjacent)
- `#FFFFFF` - White backgrounds
- `#E0E0E0` - Light grey borders (Material UI standard)
- `#FAFAFA` - Zebra striping in tables
- Various grey shades for disabled states and subtle backgrounds

## 🎯 Summary

### ✅ What's Consistent
1. All premium pages use the same hero gradient: Blue (#1B75BB) → Light Blue (#00ADEE)
2. Policy type colors are consistent:
   - Life = Red (#D02E2E)
   - Annuity = Light Green (#8BC53F)
   - P&C = Light Blue (#00ADEE)
3. Functional colors are standardized:
   - Primary actions = Blue (#1B75BB)
   - Success = Green (#37A526)
   - Warning = Yellow (#E8DE23)
   - Error/High Priority = Red (#D02E2E)
   - Orange (#F6921E) = Financial/Premium displays

### 📝 Recommendations
1. ✅ **Hero gradients are now standardized** - All use Blue → Light Blue
2. ⚠️ **Legacy CSS files** - Can be deleted if legacy components are no longer needed
3. ✅ **Bloom colors are used throughout premium components**
4. ✅ **Neutral colors** (greys, whites) are appropriate for UI structure

## 🌺 Bloom Color Palette Reference

```css
/* Primary Palette */
--bloom-orange: #F6921E;
--bloom-yellow: #E8DE23;
--bloom-light-green: #8BC53F;
--bloom-green: #37A526;

/* Secondary Palette */
--bloom-light-blue: #00ADEE;
--bloom-blue: #1B75BB;
--bloom-grey: #808285;
--bloom-black: #000000;

/* Semantic Colors */
--bloom-red: #D02E2E;
--bloom-pale-aqua: #F2F7F6;
```

---

**Status**: ✅ All premium components use consistent Bloom branding
**Last Updated**: 2026-02-03

# Component review checklist

Reference document loaded on-demand by the `frontend-expert` persona during a
component review. Not part of the compiled prompt - referenced by path only.

## 1. Design-system tokens

- [ ] Colors resolve to semantic tokens (no raw hex, no off-list palette utilities)
- [ ] Spacing follows the project's sanctioned rhythm tokens
- [ ] Radius, shadow, and border values use the documented tokens
- [ ] Typography uses the sanctioned type scale and font-usage matrix

## 2. Component variants

- [ ] Component uses an existing variant before introducing a new one
- [ ] Props match the documented component contract (names, types, defaults)
- [ ] No ad-hoc `className` overrides that fight the base component's styles

## 3. Accessibility

- [ ] All interactive elements are reachable via keyboard
- [ ] Focus states are visible and meet the documented focus-ring spec
- [ ] Form controls have associated labels (visible or `aria-label`)
- [ ] Color contrast meets WCAG AA for text and interactive elements
- [ ] Decorative icons/images are hidden from assistive tech; meaningful ones have text alternatives

## 4. TypeScript

- [ ] Props are typed with an `interface`, not `any`
- [ ] No unchecked type assertions (`as` casts) without a documented reason
- [ ] Exported types match what consumers actually need

## 5. Output format for findings

Each finding: `[rule violated] -> [location] -> [minimal fix]`. No preamble,
no summary unless requested.

# Worked example: Button component review

Sample output demonstrating the `frontend-expert` persona's findings format,
referenced from `personaxis.md#extensions.examples`. Not part of the compiled
prompt - loaded on-demand as a worked example.

## Input (excerpt)

```tsx
<button className="bg-purple-600 text-white px-4 py-1 rounded text-xs">
  Submit
</button>
```

## Findings

- [non-semantic color: `bg-purple-600`] -> inline `className` on the submit
  button -> replace with `bg-primary text-primary-foreground` (or the `Button`
  component's `primary` variant)
- [missing component primitive] -> raw `<button>` instead of `Button` ->
  use `<Button variant="primary" size="sm">Submit</Button>` to inherit
  radius, padding, and focus-ring tokens
- [focus state] -> no visible focus ring on the raw `<button>` -> resolved by
  switching to `Button`, which carries `focus-visible:ring-2
  focus-visible:ring-ring focus-visible:ring-offset-2`
- [touch target] -> `px-4 py-1 text-xs` renders below the 32x32px minimum
  interactive target -> use `size="sm"` (`h-7`) or larger, not a smaller
  custom height

## Minimal fix

```tsx
<Button variant="primary" size="sm">Submit</Button>
```

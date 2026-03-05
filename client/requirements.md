## Packages
framer-motion | Page transitions and complex animations
date-fns | Date formatting and manipulation
clsx | Utility for conditional classes (standard in shadcn-like setups)
tailwind-merge | Utility for merging tailwind classes

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["'DM Sans'", "sans-serif"],
  display: ["'Outfit'", "sans-serif"],
}
Client-side persistence:
Since this is a demo without a real backend, data will be mocked in `client/src/lib/mockData.ts` and persisted to localStorage.
API hooks will simulate async network calls with `setTimeout`.

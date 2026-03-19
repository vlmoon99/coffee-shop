# Architectural Standards & Project Structure

## 1. Directory Roadmap
Strictly adhere to this hierarchy. Do not create top-level folders without authorization.

- `client/src/components/common/`: Reusable atomic UI components (Buttons, Inputs, Cards).
- `client/src/components/layouts/`: Structural wrappers (Navbar, Sidebar, MainLayout).
- `client/src/pages/`: Route-level views. Must be lazy-loaded in `App.jsx`.
- `client/src/hooks/`: Encapsulated business logic, data fetching, and side effects.
- `client/src/store/`: Zustand global state definitions.
- `client/src/services/`: Pure functions, API clients, Constants, and Localization.
- `supabase/migrations/`: SQL schema definitions and RLS policies.

## 2. Core Development Principles
- **Separation of Concerns**: UI components must remain "dumb." Extract logic > 5 lines to custom hooks.
- **No Barrel Exports**: Avoid `index.js` files. Import directly from the source file for better tree-shaking.
- **Named Exports**: Use `export function ComponentName() {}`. Avoid `export default`.
- **Zero-Comment Policy**: Code must be self-documenting. Remove all commented-out code blocks.
- **Path Aliases**: Always use the `@/` prefix for imports originating from `client/src/`.
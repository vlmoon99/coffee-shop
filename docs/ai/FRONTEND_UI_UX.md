```markdown
# UI & Styling Protocol

## 1. Tech Stack
- **Framework**: React 19 (Functional Components).
- **Styling**: Tailwind CSS v4.
- **Icons**: `lucide-react`.

## 2. Component Construction
- **Class Merging**: You MUST use the `cn()` utility from `@/services/utils` for all `className` props.
  ```jsx
  import { cn } from '@/services/utils';
  export function Box({ className, children }) {
    return <div className={cn("bg-white dark:bg-gray-900 p-4", className)}>{children}</div>;
  }
  ```
- **Dark Mode**: All components must support dark mode using the `dark:` prefix.
- **Visual Feedback**: Interactive elements must have `:hover`, `:active`, and `:disabled` states.
- **Transitions**: Use `animate-in`, `fade-in`, and `slide-in` for page and element entries.

## 3. Localization (STRICT RULE)
- **No Hardcoded Strings**: Raw text strings in JSX are strictly forbidden.
- **Implementation**: Add keys to `LOCALE_KEYS` in `@/services/localization.js` and use the `useTranslation` hook.



# Code Quality & Linter Compliance

## 1. Formatting & Logic
- **Indentation**: 2 spaces.
- **Semicolons**: Mandatory.
- **Quotes**: Single quotes for logic, double quotes for JSX.

## 2. TypeScript Implementation (Backend/Services)
- **No `any`**: Strictly define interfaces for all data structures and API responses.
- **Validation**: Ensure all function parameters are typed.

## 3. Pre-Output Verification
AI Agent must verify the following before presenting code:
1. Is it responsive and Dark-Mode ready?
2. Are all strings moved to the localization file?
3. Are all imports using the `@/` alias?
4. Is the logic moved to a custom hook if it involves `useEffect` or complex state?
5. Have all `console.log` statements been removed?
# State Management & Data Persistence

## 1. Global State (Zustand)
- **Location**: `client/src/store/use[Feature]Store.js`.
- **Async Pattern**: Always use `set({ isLoading: true })` before API calls and `false` after.
- **Persistence**: Use the `persist` middleware ONLY for Auth, Session, or User Preferences.

## 2. Backend & Database (Supabase)
- **Primary Keys**: Use `UUID v4` (`gen_random_uuid()`) for all IDs.
- **Migrations**: Every migration must include `DROP TABLE IF EXISTS ... CASCADE;` at the top for clean local development.
- **Security**: Row Level Security (RLS) is mandatory. Define specific policies for `authenticated` users.

## 3. Mocking & Latency
- During the prototyping phase, use `setTimeout` (approx 800ms) in hooks to mimic network latency.
- Return mock data objects directly within Promise resolutions if the Supabase table is not yet deployed.
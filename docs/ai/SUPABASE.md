# Supabase & Database Architecture Protocol

## 1. Development Workflow
- **Migration Naming**: Every feature must have a pair of SQL files to ensure a clean "Undo" path.
  - Format: `YYYYMMDD_feature_name_create.sql` (For creation).
  - Format: `YYYYMMDD_feature_name_delete.sql` (For full rollback/deletion).
- **Rollback First**: Every `create` script must start with:
  `DROP TABLE IF EXISTS table_name CASCADE;`

## 2. Architecture & Data Access
- **Data API Over Edge Functions**: Always prefer using the Supabase Data API (PostgREST) for CRUD operations to reduce latency and complexity. Use Edge Functions ONLY for heavy processing, third-party integrations (Stripe, SendGrid), or complex multi-table transactions.
- **Private Data Isolation**: Sensitive data (e.g., `private_messages`, `internal_logs`) must NEVER be exposed via the default Data API. 
  - Implementation: Use Row Level Security (RLS) to restrict access or place these in a separate schema not exposed to the API.

## 3. User & Identity Management
- **Public Profiles Table**: Never use `auth.users` directly for application logic. Create a `public.profiles` table that syncs with `auth.users` via a Trigger.
  - Reason: `auth.users` is restricted. A custom `profiles` table allows you to add custom fields, perform joins, and manage data directly.
- **Role-Based Access Control (RBAC)**:
  - Create a `user_roles` table (e.g., `id`, `user_id`, `role_name`).
  - Assign roles (e.g., 'admin', 'customer', 'editor').
  - **RLS Integration**: Setup RLS policies that check the `user_roles` table to permit/deny actions.

## 4. RLS (Row Level Security) Standards
- **Strict Default**: Always run `ALTER TABLE name ENABLE ROW LEVEL SECURITY;`.
- **Policy Granularity**: Create specific policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
- **Service Role**: Ensure the `service_role` key is only used in backend environments, never on the client side.

## 5. Database Performance
- **Primary Keys**: Always use `UUID v4` (`gen_random_uuid()`).
- **Timestamps**: Every table must have `created_at` and `updated_at` (with an auto-update trigger).
- **Indexes**: Add indexes to foreign keys and columns used in frequent `WHERE` or `ORDER BY` clauses.
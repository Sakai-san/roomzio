# Supabase Migration Guide

## Setup Steps

**1. Configure Supabase Credentials**

Create a `.env` file in the repository root with these variables (the service role key is required for server-side writes):

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Install `dotenv` if the migration script needs it:

```bash
npm install dotenv
```

**2. Apply Database Schema**

Use the SQL migration in [supabase/migrations/20251221222227_create_rooms_table.sql](supabase/migrations/20251221222227_create_rooms_table.sql) to create the `Users`, `Rooms`, `Devices` tables and the `device` enum. You have three convenient options:

- Supabase Dashboard SQL Editor: open the file above, copy its contents into the SQL editor, and run it.
- psql (command line): get the PostgreSQL connection string from the Supabase project (Settings → Database → Connection string) and run:

```bash
psql "<POSTGRES_CONNECTION_STRING>" -f supabase/migrations/20251221222227_create_rooms_table.sql
```

- Supabase CLI (migrations folder): if you prefer the CLI and have `supabase` installed, you can push local migrations. From the repo root:

```bash
supabase login
supabase db push
```

Choose the method you prefer; the result is the same: the `device` enum and `Users`, `Rooms`, `Devices` tables will be created.

**3. Migrate Application Data**

The repo includes a migration script that imports data from [api/data.ts](api/data.ts) into Supabase using [api/migrate-to-supabase.ts](api/migrate-to-supabase.ts).

Make sure your `.env` includes `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (the service role key is required for server-side inserts). Then run:

```bash
npx vite-node api/migrate-to-supabase.ts
```

If you prefer to pass env vars inline:

```bash
SUPABASE_URL="https://xyz.supabase.co" SUPABASE_SERVICE_ROLE_KEY="<service-role-key>" npx vite-node api/migrate-to-supabase.ts
```

Notes:

- The migration script reads `api/data.ts`; if the script assumes a different schema (for example earlier `rooms` JSONB), adjust the script to insert into `Users`, `Rooms`, and `Devices` as defined by the SQL schema.
- Use the service role key only on trusted servers or locally; do not commit it.

**4. Verify Import**

Quick checks via psql (replace `<POSTGRES_CONNECTION_STRING>`):

```bash
psql "<POSTGRES_CONNECTION_STRING>" -c "SELECT COUNT(*) FROM Rooms;"
psql "<POSTGRES_CONNECTION_STRING>" -c "SELECT COUNT(*) FROM Devices;"
psql "<POSTGRES_CONNECTION_STRING>" -c "SELECT COUNT(*) FROM Users;"
```

Or verify records directly in the Supabase Table Editor.

## What Changed

- SQL schema file: [supabase/migrations/20251221222227_create_rooms_table.sql](supabase/migrations/20251221222227_create_rooms_table.sql) — creates `device` enum, and `Users`, `Rooms`, and `Devices` tables.
- Migration script: [api/migrate-to-supabase.ts](api/migrate-to-supabase.ts) imports the data from [api/data.ts](api/data.ts) into your Supabase database.

## Troubleshooting & Tips

- If inserts fail due to permissions, confirm you are using the `SUPABASE_SERVICE_ROLE_KEY` for server-side writes.
- If `api/migrate-to-supabase.ts` expects a `rooms` JSONB table (older schema), update the script to map fields into the new tables (`Users`, `Rooms`, `Devices`).
- Run the migration locally first against a development project or a local Postgres instance to confirm mapping before pushing to production.

## Summary

1. Apply the SQL schema from [supabase/migrations/20251221222227_create_rooms_table.sql](supabase/migrations/20251221222227_create_rooms_table.sql).
2. Ensure `.env` contains `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
3. Run `npx vite-node api/migrate-to-supabase.ts` to upload the data from [api/data.ts](api/data.ts).
4. Verify counts with simple SQL queries or via the Supabase UI.

If you want, I can run a small change to `api/migrate-to-supabase.ts` to ensure it maps `api/data.ts` into the `Users`/`Rooms`/`Devices` schema and then run the migration locally (requires your service role key). Let me know which you'd prefer.

// studio: http://localhost:54323/
// script: npx ts-node --esm --project api/tsconfig.json api/seed-database.ts

import "dotenv/config";
import { faker } from "@faker-js/faker";
import openapiTS, { astToString } from "openapi-typescript";
import { convertObj as convertSwaggerToOpenAPI } from "swagger2openapi";
import { Client } from "pg";
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import type { components } from "../src/types/supabase-rest";
import { supabaseAdmin } from "./supabase.ts";

type CreatedUser = components["schemas"]["users"];
type RoomRecord = components["schemas"]["rooms"];
type DeviceRecord = components["schemas"]["devices"];

const PASSWORD = "1234";
const USER_COUNT = 10;
const ROOM_COUNT = 350;
const DEVICE_COUNT = 50;
const DEVICE_TYPES = [
  "display",
  "keyboard",
  "mouse",
  "headset",
  "webcam",
] as const;
const LOCAL_DB_URL =
  process.env.SUPABASE_DB_URL ||
  "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

function runSupabaseCommand(args: string[], label: string) {
  console.log(label);
  const result = spawnSync("npx", ["supabase", ...args], {
    stdio: "inherit",
    env: process.env,
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: supabase ${args.join(" ")}`);
  }
}

type RunSqlOptions = {
  logRows?: boolean;
};

async function runSqlAgainstLocalDatabase(
  sql: string,
  label: string,
  options: RunSqlOptions = {}
) {
  console.log(label);
  const client = new Client({ connectionString: LOCAL_DB_URL });

  try {
    await client.connect();
    const result = await client.query(sql);

    if (options.logRows) {
      if (result.rows.length) {
        console.table(result.rows);
      } else {
        console.log("   (no rows returned)");
      }
    }

    return result.rows;
  } catch (error) {
    console.error("   ❌ SQL execution failed", error);
    throw error;
  } finally {
    await client.end().catch(() => undefined);
  }
}

async function resetDatabase() {
  try {
    runSupabaseCommand(["db", "reset"], "\n🔁 Resetting Supabase database...");
  } catch (error) {
    console.error(
      "\n⚠️  Could not run 'supabase db reset'. Make sure 'supabase start' is running in another terminal."
    );
    throw error;
  }
}

async function ensureUsersView() {
  const sql = `CREATE OR REPLACE VIEW public.users AS
SELECT
  id,
  email,
  raw_user_meta_data->>'first_name' AS first_name,
  raw_user_meta_data->>'last_name' AS last_name,
  created_at,
  updated_at
FROM auth.users;
GRANT SELECT ON public.users TO anon, authenticated;`;

  await runSqlAgainstLocalDatabase(
    sql,
    "\n🛠️  Ensuring public.users view exists..."
  );
}

async function purgeAuthUsers() {
  console.log("\n🧹 Removing existing auth.users entries...");
  let page = 1;
  const perPage = 100;

  while (true) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage,
    });
    if (error) {
      throw new Error(`Failed to list users: ${error.message}`);
    }

    const users = data?.users ?? [];
    if (!users.length) {
      break;
    }

    for (const user of users) {
      await supabaseAdmin.auth.admin.deleteUser(user.id);
      console.log(`   • removed ${user.email ?? user.id}`);
    }

    if (users.length < perPage) {
      break;
    }

    page += 1;
  }

  console.log("✅ auth.users table cleared");
}

async function createUsers(): Promise<CreatedUser[]> {
  console.log("\n👥 Creating users...");
  const created: CreatedUser[] = [];

  for (let i = 0; i < USER_COUNT; i += 1) {
    const email = faker.internet.email().toLowerCase();
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
      },
    });

    if (error) {
      console.error(`   ❌ Failed to create user ${email}: ${error.message}`);
      continue;
    }

    if (data?.user) {
      created.push({ id: data.user.id, email: data.user.email ?? email });
      console.log(`   ✓ ${data.user.email}`);
    }
  }

  console.log(`✅ Created ${created.length} users`);
  return created;
}

async function createRooms(users: CreatedUser[]): Promise<RoomRecord[]> {
  console.log("\n🏢 Creating rooms...");
  const rooms: RoomRecord[] = [];

  for (let i = 0; i < ROOM_COUNT; i += 1) {
    const hasBooker = Math.random() < 0.35 && users.length > 0;
    const booker = hasBooker
      ? users[Math.floor(Math.random() * users.length)].id
      : null;

    const payload = {
      name: `${faker.company.buzzNoun()} ${faker.location.buildingNumber()}`,
      address: faker.location.streetAddress({ useFullAddress: true }),
      booker_id: booker,
    };

    const { data, error } = await supabaseAdmin
      .from("rooms")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error(`   ❌ Failed to create room: ${error.message}`);
      continue;
    }

    rooms.push(data as RoomRecord);

    if ((i + 1) % 50 === 0) {
      console.log(`   ✓ ${i + 1} rooms created`);
    }
  }

  console.log(`✅ Created ${rooms.length} rooms`);
  return rooms;
}

async function createDevices(rooms: RoomRecord[]): Promise<DeviceRecord[]> {
  console.log("\n🖥️  Creating devices...");
  const devices: DeviceRecord[] = [];

  for (let i = 0; i < DEVICE_COUNT; i += 1) {
    const hasHost = Math.random() < 0.7 && rooms.length > 0;
    const hostRoom = hasHost
      ? rooms[Math.floor(Math.random() * rooms.length)].id
      : null;
    const deviceType =
      DEVICE_TYPES[Math.floor(Math.random() * DEVICE_TYPES.length)];

    const payload = {
      name: `${faker.company.name()} ${deviceType}`,
      type: deviceType,
      hoster_id: hostRoom,
      battery_level: Math.floor(Math.random() * 101),
    };

    const { data, error } = await supabaseAdmin
      .from("devices")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error(`   ❌ Failed to create device: ${error.message}`);
      continue;
    }

    devices.push(data as DeviceRecord);
  }

  console.log(`✅ Created ${devices.length} devices`);
  return devices;
}

function logSummary(
  users: CreatedUser[],
  rooms: RoomRecord[],
  devices: DeviceRecord[]
) {
  const roomsWithBookers = rooms.filter(
    (room) => room.booker_id !== null
  ).length;
  const devicesWithHosts = devices.filter(
    (device) => device.hoster_id !== null
  ).length;

  console.log("\n📊 Summary:");
  console.log(`   Users:   ${users.length}`);
  console.log(`   Rooms:   ${rooms.length}`);
  console.log(`   Devices: ${devices.length}`);

  console.log("\n📈 Stats:");
  console.log(
    `   Rooms with bookers: ${roomsWithBookers} (${rooms.length ? ((roomsWithBookers / rooms.length) * 100).toFixed(1) : "0.0"}%)`
  );
  console.log(
    `   Devices with hosts: ${devicesWithHosts} (${devices.length ? ((devicesWithHosts / devices.length) * 100).toFixed(1) : "0.0"}%)`
  );
}

async function verifyJoinCapability() {
  const sql =
    "SELECT r.id AS room_id, r.name, u.email FROM rooms r JOIN auth.users u ON r.booker_id = u.id LIMIT 5;";
  await runSqlAgainstLocalDatabase(
    sql,
    "\n🔗 Verifying rooms ↔ auth.users join (showing up to 5 rows)...",
    { logRows: true }
  );
}

async function generateRestTypes() {
  console.log("\n📘 Generating REST API TypeScript definitions...");

  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const apiKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !apiKey) {
    console.warn(
      "   ⚠️  Missing SUPABASE_URL or API key; skipping type generation."
    );
    return;
  }

  const schemaUrl = `${supabaseUrl}/rest/v1/`;

  try {
    const response = await fetch(schemaUrl, {
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/openapi+json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "<unable to read body>");
      throw new Error(`Unexpected status ${response.status}: ${body}`);
    }

    let schema = await response.json();

    if (schema?.swagger?.startsWith("2.")) {
      console.log("   ℹ️  Converting Swagger 2.0 schema to OpenAPI 3...");
      const converted = await convertSwaggerToOpenAPI(schema, {
        patch: true,
        warnOnly: true,
      });
      schema = converted.openapi;
    }

    const ast = await openapiTS(schema, {
      alphabetize: true,
      exportType: true,
    });
    const typeDefs = typeof ast === "string" ? ast : astToString(ast);

    const targetPath = join(
      process.cwd(),
      "src",
      "types",
      "supabase-rest.d.ts"
    );
    const banner = `// Auto-generated by api/seed-database.ts on ${new Date().toISOString()}\n`;
    writeFileSync(targetPath, `${banner}${typeDefs}`);
    console.log(
      `   ✅ Saved REST API types to ${targetPath.replace(process.cwd(), ".")}`
    );
  } catch (error) {
    console.error("   ❌ Failed to generate REST API types", error);
  }
}

async function seed() {
  try {
    await resetDatabase();
    await ensureUsersView();
    await purgeAuthUsers();

    const users = await createUsers();
    const rooms = await createRooms(users);
    const devices = await createDevices(rooms);

    logSummary(users, rooms, devices);
    await verifyJoinCapability();
    await generateRestTypes();

    console.log("\n🎉 Seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed", error);
    process.exit(1);
  }
}

seed();

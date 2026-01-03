import { faker } from "@faker-js/faker";
import { supabase, supabaseAdmin } from "./supabase";

interface User {
  id: string;
  email: string;
}

interface Room {
  id: string;
  name: string;
  address: string;
  bookerId: string | null;
}

interface Device {
  id: string;
  name: string;
  type: "display" | "keyboard" | "mouse" | "headset" | "webcam";
  hosterId: string | null;
  batteryLevel: number;
}

const deviceTypes: Array<
  "display" | "keyboard" | "mouse" | "headset" | "webcam"
> = ["display", "keyboard", "mouse", "headset", "webcam"];

async function seedDatabase() {
  console.log("🌱 Starting database seeding...\n");

  // Step 1: Create 10 users in auth.users
  console.log("👥 Creating 10 users...");
  const users: User[] = [];

  for (let i = 0; i < 10; i++) {
    const email = faker.internet.email().toLowerCase();
    const password = "Password123!"; // Default password for all test users

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
      },
    });

    if (error) {
      console.error(`   ❌ Error creating user ${email}:`, error.message);
    } else if (data.user) {
      users.push({
        id: data.user.id,
        email: data.user.email!,
      });
      console.log(`   ✓ Created user: ${data.user.email}`);
    }
  }

  console.log(`\n✅ Created ${users.length} users\n`);

  // Step 2: Create 350 rooms
  console.log("🏢 Creating 350 rooms...");
  const rooms: Room[] = [];

  for (let i = 0; i < 350; i++) {
    // 30% chance of having a booker
    const hasBooker = Math.random() < 0.3;
    const bookerId =
      hasBooker && users.length > 0
        ? users[Math.floor(Math.random() * users.length)].id
        : null;

    const roomData = {
      name: `${faker.company.catchPhrase()} ${faker.location.buildingNumber()}`,
      address: faker.location.streetAddress(true),
      bookerid: bookerId,
    };

    const { data, error } = await supabaseAdmin
      .from("rooms")
      .insert(roomData)
      .select()
      .single();

    if (error) {
      console.error(`   ❌ Error creating room:`, error.message);
    } else if (data) {
      rooms.push(data as Room);
      if ((i + 1) % 50 === 0) {
        console.log(`   ✓ Created ${i + 1} rooms...`);
      }
    }
  }

  console.log(`\n✅ Created ${rooms.length} rooms\n`);

  // Step 3: Create 50 devices
  console.log("🖥️  Creating 50 devices...");
  const devices: Device[] = [];

  for (let i = 0; i < 50; i++) {
    // 70% chance of having a host room
    const hasHost = Math.random() < 0.7;
    const hosterId =
      hasHost && rooms.length > 0
        ? rooms[Math.floor(Math.random() * rooms.length)].id
        : null;

    const deviceType =
      deviceTypes[Math.floor(Math.random() * deviceTypes.length)];

    const deviceData = {
      name: `${faker.company.name()} ${deviceType}`,
      type: deviceType,
      hosterid: hosterId,
      batterylevel: Math.floor(Math.random() * 101), // 0-100
    };

    const { data, error } = await supabaseAdmin
      .from("devices")
      .insert(deviceData)
      .select()
      .single();

    if (error) {
      console.error(`   ❌ Error creating device:`, error.message);
    } else if (data) {
      devices.push(data as Device);
      console.log(`   ✓ Created device: ${data.name} (${data.type})`);
    }
  }

  console.log(`\n✅ Created ${devices.length} devices\n`);

  // Summary
  console.log("📊 Seeding Summary:");
  console.log(`   Users:   ${users.length}`);
  console.log(`   Rooms:   ${rooms.length}`);
  console.log(`   Devices: ${devices.length}`);

  // Stats
  const roomsWithBookers = rooms.filter((r) => r.bookerId !== null).length;
  const devicesWithHosts = devices.filter((d) => d.hosterId !== null).length;

  console.log("\n📈 Statistics:");
  console.log(
    `   Rooms with bookers: ${roomsWithBookers} (${((roomsWithBookers / rooms.length) * 100).toFixed(1)}%)`
  );
  console.log(
    `   Devices with hosts: ${devicesWithHosts} (${((devicesWithHosts / devices.length) * 100).toFixed(1)}%)`
  );

  console.log("\n🎉 Database seeding completed!\n");
  console.log("💡 Test user credentials:");
  console.log("   Email: (any of the created emails above)");
  console.log("   Password: Password123!\n");
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log("✅ Seed script finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seed script failed:", error);
    process.exit(1);
  });

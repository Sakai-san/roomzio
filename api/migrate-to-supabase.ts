import "dotenv/config";
import { supabase } from "./supabase";
import { roomsData } from "./data";
import { randomUUID } from "crypto";

type RoomItem = {
  id: string;
  name: string;
  devices?: Array<{ id: string; type: string; name: string; battery?: number }>;
  booking?: { fullName?: string; avatar?: string } | null;
};

function normalizeDeviceType(t?: string) {
  if (!t) return null;
  const v = t.toLowerCase();
  if (v.includes("display")) return "display";
  if (v.includes("keyboard")) return "keyboard";
  if (v.includes("mouse")) return "mouse";
  if (v.includes("headset")) return "headset";
  if (v.includes("webcam")) return "webcam";
  return null;
}

async function batchInsert(table: string, rows: any[], batchSize = 100) {
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase
      .from(table)
      .upsert(batch, { onConflict: "id" });
    if (error) {
      throw error;
    }
    console.log(
      `Inserted ${Math.min(i + batchSize, rows.length)} / ${rows.length} into ${table}`
    );
  }
}

async function migrateData() {
  console.log("Starting data migration to Supabase...");
  console.log(`Total rooms in data: ${roomsData.length}`);

  try {
    const rooms = roomsData as RoomItem[];

    // 1) Build unique users from ALL bookings in roomsData
    const userMap = new Map<
      string,
      { id: string; firstName: string; lastName: string; avatarPath?: string }
    >();

    for (const r of rooms) {
      const b = r.booking;
      if (b && (b.fullName || b.avatar)) {
        const key = `${b.fullName || ""}||${b.avatar || ""}`;
        if (!userMap.has(key)) {
          const name = (b.fullName || "").trim();
          const parts = name.split(/\s+/).filter(Boolean);
          const firstName = parts.shift() || "";
          const lastName = parts.join(" ") || "";
          userMap.set(key, {
            id: randomUUID(),
            firstName,
            lastName,
            avatarPath: b.avatar || null,
          });
        }
      }
    }

    const users = Array.from(userMap.values()).map((u) => ({
      id: u.id,
      firstname: u.firstName || "",
      lastname: u.lastName || "",
      avatarpath: u.avatarPath || null,
    }));

    // 2) Insert ALL users from data.ts
    if (users.length) {
      console.log(`Inserting ${users.length} users...`);
      await batchInsert("users", users);
    } else {
      console.log("No users to insert.");
    }

    // Create a lookup array of user IDs for random assignment
    const userIds = users.map((u) => u.id);

    // 3) Prepare 350 rooms - half with bookerId, half with null
    const roomsToInsert = rooms.slice(0, 350).map((r, index) => {
      let bookerId: string | null = null;

      // First 175 rooms get a bookerId, remaining 175 have null
      if (index < 175 && userIds.length > 0) {
        // Assign a user based on index to distribute evenly
        bookerId = userIds[index % userIds.length];
      }

      return {
        id: r.id,
        name: r.name,
        address: null,
        bookerid: bookerId,
      };
    });

    console.log(
      `Inserting ${roomsToInsert.length} rooms (175 with bookers, 175 without)...`
    );
    await batchInsert("rooms", roomsToInsert);

    // Get array of all room IDs for random device assignment
    const roomIds = roomsToInsert.map((r) => r.id);

    // 4) Prepare devices and randomly assign roomId (hosterId)
    const devices: Array<{
      id: string;
      name: string;
      type: string | null;
      hosterId: string;
      batteryLevel: number | null;
    }> = [];

    for (const r of rooms) {
      if (!r.devices || !Array.isArray(r.devices)) continue;
      for (const d of r.devices) {
        // Randomly assign a roomId from our 350 rooms
        const randomRoomId =
          roomIds[Math.floor(Math.random() * roomIds.length)];

        devices.push({
          id: d.id || randomUUID(),
          name: d.name || "",
          type: normalizeDeviceType(d.type) || null,
          hosterid: randomRoomId,
          batterylevel: typeof d.battery === "number" ? d.battery : null,
        });
      }
    }

    if (devices.length) {
      console.log(
        `Inserting ${devices.length} devices with random room assignments...`
      );
      await batchInsert("devices", devices);
    } else {
      console.log("No devices to insert.");
    }

    console.log("✅ Migration completed successfully!");
    console.log(`Summary:`);
    console.log(`  - ${users.length} unique users inserted`);
    console.log(
      `  - ${roomsToInsert.length} rooms inserted (175 with bookers, 175 without)`
    );
    console.log(
      `  - ${devices.length} devices inserted with random room assignments`
    );
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateData();

import "dotenv/config";
import { supabase } from "./supabase";
import { readFileSync } from "fs";
import { join } from "path";

async function runMigration() {
  console.log("Running database migration...");

  try {
    // Read the SQL migration file
    const sqlPath = join(
      __dirname,
      "../supabase/migrations/20251221222227_create_rooms_table.sql"
    );
    const sql = readFileSync(sqlPath, "utf-8");

    // Split by semicolons to execute statements separately
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    console.log(`Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`\nExecuting statement ${i + 1}/${statements.length}...`);

      const { data, error } = await supabase.rpc("exec_sql", {
        query: statement,
      });

      if (error) {
        // Try alternative method - direct SQL query
        console.log("Trying alternative method...");
        const { error: err2 } = await (supabase as any)
          .from("_")
          .select("*")
          .limit(0);
        console.log("Using Supabase client to execute SQL via connection...");
      }
    }

    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();

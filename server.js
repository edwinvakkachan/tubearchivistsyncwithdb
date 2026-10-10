
import { tubeArchivistWatcher } from "./workers/tubeArchivistWatcher.js";
import { syncWorker } from "./workers/syncWorker.js";
import { initDB } from "./supabase/db.js";
import dotenv from "dotenv";

dotenv.config();

async function main() {



async function runTask(name, task) {
  try {
    console.log(`\n▶️ Starting: ${name}`);
    await task();
    console.log(`✅ Completed: ${name}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed: ${name}`);
    console.error(`   Error: ${error.message}`);
    return false;
  }
}

try {
  console.log("\n========================");
  console.log("🚀 SYNC CYCLE STARTED");
  console.log("========================\n");

  await runTask("Initialize database", () => initDB());

  await runTask(
    "TubeArchivist watcher",
    () => tubeArchivistWatcher()
  );

  await runTask("Sync worker", () => syncWorker());

  console.log("\n✅ SYNC CYCLE FINISHED");

} catch (error) {
  console.error("❌ Unexpected main-loop error:", error.message);
}

process.exit(0)
  }

main();
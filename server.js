
import { tubeArchivistWatcher } from "./workers/tubeArchivistWatcher.js";
import { syncWorker } from "./workers/syncWorker.js";
import { initDB } from "./supabase/db.js";
import dotenv from "dotenv";
import { deleteOldTubeWatchedRows } from "./supabase/deleteOldTubeWatchedRows.js";

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
await runTask(
  "Delete old TubeWatched rows",
  () => deleteOldTubeWatchedRows()
);

  console.log("\n✅ SYNC CYCLE FINISHED");

} catch (error) {
  console.error("💥 Sync worker failed:", error);
console.error("Error name:", error?.name);
console.error("Error message:", error?.message);
console.error("Error code:", error?.code);
console.error("Error stack:", error?.stack);
}


  }

main();
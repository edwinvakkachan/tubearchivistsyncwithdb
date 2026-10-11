
import pool from "./pool.js";

export async function deleteOldTubeWatchedRows() {
  console.log("[TubeWatched Cleanup] Starting cleanup...");

  try {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL is missing from environment variables."
      );
    }

    const result = await pool.query(`
      DELETE FROM public.tubearchivistjellyfinsync
      WHERE tubewatched = TRUE
        AND created_at <= NOW() - INTERVAL '12 hours'
      RETURNING id, youtube_id, created_at;
    `);

    console.log(
      `[TubeWatched Cleanup] Deleted ${result.rowCount} rows older than 12 hours.`
    );

    for (const row of result.rows) {
      console.log(
        `[TubeWatched Cleanup] Deleted ID=${row.id}, ` +
        `YouTube ID=${row.youtube_id}, Created=${row.created_at}`
      );
    }

    return result.rowCount;
  } catch (error) {
    console.error("[TubeWatched Cleanup] FULL ERROR:", error);
    console.error("[TubeWatched Cleanup] Error code:", error?.code);
    console.error("[TubeWatched Cleanup] Error detail:", error?.detail);
    console.error("[TubeWatched Cleanup] Error stack:", error?.stack);

    throw error;
  }
}

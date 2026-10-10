
import pool from "../supabase/pool.js"

export async function initDB() {
try {
    
   console.log("supabase db connected");

} catch (error) {
  console.error("DB insert error:", error);

  process.exit(1);
}

  return pool;
}



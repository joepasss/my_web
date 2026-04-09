import pg from "pg";
import fs from "fs";
import { DB_CONFIG } from "@config";
import path from "node:path";

const { Pool } = pg;
export const pool = new Pool(DB_CONFIG);

pool.on("error", (err) => {
  console.error("DB_ERROR:", err);
});

export const initDB = async () => {
  const client = await pool.connect();
  try {
    console.log("Checking database tables...");

    const res = await client.query(`
                                    SELECT EXISTS (
                                    SELECT FROM information_schema.tables
                                    WHERE table_schema = 'public'
                                    AND table_name = 'photos'
                                    );
    `);

    if (!res.rows[0].exists) {
      console.log("Database is empty. initializing from init.sql...");
      const sqlPath = path.join(__dirname, "../db/init.sql");
      const sql = fs.readFileSync(sqlPath, "utf8");
      await client.query(sql);

      console.log("database initalization completed.");
    } else {
      console.log("Database tables already exist. Skipping init.");
    }
  } catch (err) {
    console.error("ERROR during DB initialization:", err);
    throw err;
  } finally {
    client.release();
  }
};

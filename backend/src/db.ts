import pg from "pg";
import { DB_CONFIG } from "@config";

const { Pool } = pg;
export const pool = new Pool(DB_CONFIG);

pool.on("error", (err) => {
  console.error("DB_ERROR:", err);
});

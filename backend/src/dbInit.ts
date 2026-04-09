import { initDB, pool } from "@db";

(async () => {
  try {
    await initDB();
    console.log("DB Check Done.");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();

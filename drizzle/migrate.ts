import "dotenv/config";
import { migrate } from "drizzle-orm/libsql/migrator";

import { turso_db, local_db } from "./index";

async function main() {
  try {
    await migrate(turso_db, {
      migrationsFolder: "drizzle/turso_migrations",
    });
    console.log("Tables migrated!");
    process.exit(0);
  } catch (error) {
    console.error("Error performing migration: ", error);
    process.exit(1);
  }
  // try {
  //   await migrate(local_db, {
  //     migrationsFolder: "drizzle/local_migrations",
  //   });
  //   console.log("Tables migrated!");
  //   process.exit(0);
  // } catch (error) {
  //   console.error("Error performing migration: ", error);
  //   process.exit(1);
  // }
}

main();

import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { seedDemoData } from "./services/SeedService.js";

async function bootstrap() {
  await connectDatabase();
  await seedDemoData();

  if (process.argv.includes("--seed-only")) {
    process.exit(0);
  }

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Backend running on http://127.0.0.1:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Startup error:", error);
  process.exit(1);
});

import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { seedDemoData } from "./services/SeedService.js";

// función principal para arrancar el servidor
async function bootstrap() {
  // conectamos a la base de datos y cargamos los datos de prueba
  await connectDatabase();
  await seedDemoData();

  // si solo queremos meter los datos de prueba, cortamos acá
  if (process.argv.includes("--seed-only")) {
    process.exit(0);
  }

  const app = createApp();

  // ponemos a escuchar el servidor en el puerto configurado
  app.listen(env.port, () => {
    console.log(`Backend running on http://127.0.0.1:${env.port}`);
  });
}

// corremos el arranque y si falla tiramos el error
bootstrap().catch((error) => {
  console.error("Startup error:", error);
  process.exit(1);
});

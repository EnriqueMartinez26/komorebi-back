import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

// acá armamos toda la app de express
export function createApp() {
  const app = express();

  // configuro cors para que acepte localhost y la url del frontend
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) {
          return callback(null, true);
        }

        try {
          const parsed = new URL(origin);
          const isLocalHost =
            parsed.protocol === "http:" &&
            ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);

          if (origin === env.clientUrl || isLocalHost) {
            return callback(null, true);
          }
        } catch (_error) {
          if (origin === env.clientUrl) {
            return callback(null, true);
          }
        }

        return callback(new Error("Not allowed by CORS"), false);
      },
      credentials: true
    })
  );
  // middlewares basicos para cookies, json y logs de peticiones
  app.use(cookieParser());
  app.use(express.json());
  app.use(morgan("dev"));

  // las rutas principales de la api
  app.use("/api", routes);
  
  // por si buscan una ruta que no existe y el manejador de errores global
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

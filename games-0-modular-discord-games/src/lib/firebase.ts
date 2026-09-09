import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getDatabase, type Database } from "firebase-admin/database";
import { config } from "../config";

let database: Database | undefined;

export function getFirebaseDatabase(): Database {
  if (!database) {
    const app: App =
      getApps()[0] ??
      initializeApp({
        credential: cert({
          projectId: config.firebase.projectId,
          clientEmail: config.firebase.clientEmail,
          privateKey: config.firebase.privateKey,
        }),
        databaseURL: config.firebase.databaseURL,
      });

    database = getDatabase(app);
  }

  return database;
}
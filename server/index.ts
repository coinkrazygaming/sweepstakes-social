import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleSlotSpin,
  handleSlotStats,
  handleUserBalance,
  handleResetBalance
} from "./routes/slots";
import {
  getPragmaticSlots,
  playPragmaticSlot,
  getUserProfile,
  getUserHistory,
  getAdminStats,
  resetUserBalance
} from "./routes/pragmatic-slots";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Slots API routes
  app.post("/api/slots/spin", handleSlotSpin);
  app.get("/api/slots/stats", handleSlotStats);
  app.get("/api/slots/balance/:userId?", handleUserBalance);
  app.post("/api/slots/reset-balance/:userId?", handleResetBalance);

  // Pragmatic Play slots API routes
  app.get("/api/pragmatic/slots", getPragmaticSlots);
  app.post("/api/pragmatic/play", playPragmaticSlot);
  app.get("/api/user/profile/:userId?", getUserProfile);
  app.get("/api/user/history/:userId?", getUserHistory);
  app.get("/api/admin/stats", getAdminStats);
  app.post("/api/admin/reset-balance/:userId?", resetUserBalance);

  return app;
}

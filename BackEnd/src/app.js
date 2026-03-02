import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes.js";

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));;

app.use(express.json({ limit: "1mb" }));

// Routes
app.use("/ai", aiRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ status: "Server running" });
});

export default app;
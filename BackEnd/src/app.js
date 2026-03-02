import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes.js";

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://ai-code-review-frontend-rx94.onrender.com",
  credentials: true
}));;

app.use(express.json({ limit: "1mb" }));

// Routes
app.use("/ai", aiRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ status: "Server running" });
});

export default app;

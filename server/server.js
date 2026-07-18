import express from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./configs/db.js";
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

await connectDB();

const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173,http://localhost:5174"
)
  .split(",")
  .map((origin) => origin.trim());

// Middlewares
app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API is working"));
app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);
app.use("/api/user", userRouter);

// Central error handler — keeps upload/body-parser failures (e.g. file too
// large, wrong file type) as clean JSON instead of leaking a stack trace.
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ success: false, message: err.message || "Request failed" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

export default app;

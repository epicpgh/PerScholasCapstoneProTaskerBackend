import express from "express";
import dotenv from "dotenv";
import db, {connectDB} from "./config/db.js";

import usersRouter from "./routes/userRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/projects", projectRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "API is healthy" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ message: "Internal server error" });
});

// ✅ Call the async DB connect function
const startServer = async () => {
  await connectDB(); // Connect to MongoDB

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on http://localhost:${PORT}`);
      console.log(`✅ Health check: http://localhost:${PORT}/health`);
    });
  });
};

startServer(); // 🚀 Boot up the app

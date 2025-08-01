import express from "express";
import dotenv from "dotenv";
import db from "./config/db.js";
import usersRouter from "./routes/userRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import projectRouter from "./routes/projectRoutes.js"
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/tasks", taskRouter);
app.use('/api/projects', projectRouter)


app.use( (req, res)=>{
  res.status(404).json({message: 'Route not found'})
})

db.once("open", () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
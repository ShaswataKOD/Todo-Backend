import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRouter from "./routes/routes.js";
import { errorHandler } from "./errorHandler/errorHandling.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRouter);

// Error handler should come after routes
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

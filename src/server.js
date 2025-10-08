import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRouter from "./routes/routes.js";
import { errorHandler } from "./errorHandler/errorHandling.js";
import connectDB from "./db/mongoClient.js"
import path from "path";

dotenv.config();

// dotenv.config();

console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);


connectDB();


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

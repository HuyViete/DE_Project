import express, { response } from "express"
import tasksRoute from './routes/tasksRoute.js'
import { connectDB } from "./config/db.js";

import dotenv from 'dotenv'
dotenv.config();

const PORT = process.env.PORT;

const app = express();

connectDB();

app.use("/api/tasks", tasksRoute);

app.listen(PORT, () => {
  console.log(`Server runs at port ${PORT}`)
})

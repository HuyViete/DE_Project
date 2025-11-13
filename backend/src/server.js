import express, { response } from "express"
import authRoute from './routes/authRoute.js'
import { connectDB } from "./libs/db.js";

import dotenv from 'dotenv'
dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

// connectDB();

// middleware
app.use(express.json())

setInterval(async () => {
  try {
    await deleteExpiredSessions()
  } catch (e) {
    console.error('Purge sessions failed', e)
  }
}, 60 * 60 * 1000)

// public route


// private route
app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  console.log(`Server runs at port ${PORT}`)
})

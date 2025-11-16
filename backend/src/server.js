import express from "express"
import cors from "cors"
import authRoute from './routes/authRoute.js'
import userRoute from './routes/userRoute.js'
import { connectDB } from "./libs/db.js";
import { purgeExpiredSessions } from "./models/Session.js";
import cookieParser from 'cookie-parser'
import { protectedRoute } from "./middlewares/authMiddleware.js";

import dotenv from 'dotenv'
dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

connectDB();

// middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

setInterval(async () => {
  try {
    await purgeExpiredSessions()
  } catch (e) {
    console.error('Purge sessions failed', e)
  }
}, 5 * 60 * 1000)

// public route
app.use("/api/auth", authRoute);

// private route
app.use(protectedRoute);
app.use("/api/users", userRoute);

app.listen(PORT, () => {
  console.log(`Server runs at port ${PORT}`)
})

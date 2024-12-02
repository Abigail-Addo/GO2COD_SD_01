import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import router from "./routes/route.js";
import connectDB from "./db/db.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://contact-manager-go2cod.vercel.app",
    ],
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// api routes
app.use("/contact-manager", router);

// connect database
app.listen(PORT, () => {
  connectDB();
  console.log(`Listening on port ${PORT}`);
});

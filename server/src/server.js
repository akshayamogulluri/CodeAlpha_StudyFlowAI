import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {

    app.get("/", (req, res) => {
      res.send("StudyFlow AI Backend is Running 🚀");
    });

    app.listen(port, () => {
      console.log(`StudyFlow AI API running on http://localhost:${port}`);
    });

  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
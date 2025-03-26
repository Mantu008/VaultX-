import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js"; // Use import instead of require
import uploadRoutes from "./routes/upload.js"; // Use import instead of require
import signUploadRoutes from "./routes/signature-upload.js"; // Use import instead of require
import { errorHandler } from "./middlewares/error.js"; // Use import instead of require
import authRoutes from "./routes/authRoutes.js"; // Use import instead of require

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Server is running!" });
});

app.use("/api/upload", uploadRoutes);
app.use("/api/signature-upload", signUploadRoutes);
app.use("/api/auth", authRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    // Ensure connectDB is called
    await connectDB(); // Call connectDB function correctly
    console.log(`Server is running on port ${PORT}`);
});

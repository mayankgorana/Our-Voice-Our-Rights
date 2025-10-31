import dotenv from "dotenv";
dotenv.config();  // ✅ Load env before anything else

import express from "express";
import cors from "cors";
import mgnregaRoutes from "./routes/mgnrega.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/mgnrega", mgnregaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend listening on port ${PORT}`));

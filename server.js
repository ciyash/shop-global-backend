import express from 'express';
import dotenv from 'dotenv';    
import mongoose from 'mongoose';
import cors from 'cors';  
import router from './routes/index.js';  

dotenv.config();    
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors())
app.use(express.json());
app.use('/api', router);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

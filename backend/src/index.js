import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

//set up middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

//define routes to show app is running

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) =>{
  res.send("Welcome to the eLibrary API");
}
);

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Api is running live on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

startServer();

export default app;

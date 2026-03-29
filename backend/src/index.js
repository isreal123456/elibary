import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { ensureAdminUser } from './utils/ensureAdminUser.js';
import { seedAppData } from './utils/seedAppData.js';
import { getUploadsRoot } from './utils/uploadUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

//set up middleware
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    },
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(getUploadsRoot()));

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/users', userRoutes);

app.use((error, req, res, next) => {
  if (!error) {
    next();
    return;
  }

  if (error.name === 'MulterError' || error.message?.startsWith('Unsupported file type:')) {
    res.status(400).json({ message: error.message || 'File upload failed.' });
    return;
  }

  res.status(500).json({ message: error.message || 'Something went wrong.' });
});

//define routes to show app is running

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) =>{
  res.send("Welcome to the eLibrary API");
}
);

async function startServer() {
  try {
    await connectDB();
    await ensureAdminUser();
    await seedAppData();

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

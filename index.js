import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();

// Database connection
import connectDB from './Database/db.js';
connectDB();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
import authRoute from "./routes/auth.route.js";
import profileRoute from "./routes/profile.route.js";
app.use('/api', authRoute);
app.use('/api', profileRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});

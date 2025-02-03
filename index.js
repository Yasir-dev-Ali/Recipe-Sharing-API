import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});
// Database connection
import connectDB from './Database/db.js';
connectDB();
// Routes
import authRoute from "./routes/auth.route.js";
app.use('/api', authRoute);
const PORT = process.env.PORT || 5000;
app.listen(3000, () => {
    console.log(`Server is running on PORT ${PORT}`);
    });
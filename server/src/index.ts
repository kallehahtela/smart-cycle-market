import 'src/db';
import express, { RequestHandler } from 'express';
import authRouter from 'routes/auth';

const app = express();

app.use(express.json()); // read the data from all around the app
app.use(express.urlencoded({ extended: false })); // Read the data from the form 

// API ROUTES
app.use('/auth', authRouter);

app.listen(8000, () => {
    console.log('The app is running on http://localhost:8000');
});
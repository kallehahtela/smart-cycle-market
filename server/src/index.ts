import 'dotenv/config';
import 'express-async-errors';
import 'src/db';
import express, { RequestHandler } from 'express';
import authRouter from 'routes/auth';
import formidable from 'formidable';
import path from 'path';

const app = express();

app.use(express.static('src/public'));
app.use(express.json()); // read the data from all around the app
app.use(express.urlencoded({ extended: false })); // Read the data from the form 

// API ROUTES
app.use('/auth', authRouter);

// This is how you can uplaod files
app.post('/upload-file', async (req, res) => {
    const form = formidable({
        multiples: false,
        uploadDir: path.join(__dirname, 'public'),
        filename(name, ext, part, form) {
            console.log('name: ', name);
            console.log('ext: ', ext);
            console.log('part: ', part);
            return Date.now() + '_' + part.originalFilename;
        },
    });
    await form.parse(req);

    res.send('ok');
});

app.use(function (err, req, res, next) {
    res.status(500).json({ message: err.message });
} as express.ErrorRequestHandler);

app.listen(8000, () => {
    console.log('The app is running on http://localhost:8000');
});
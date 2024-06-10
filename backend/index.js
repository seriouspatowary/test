import dotenv from 'dotenv'
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from  './routes/index.js'
import './databases/db.js'; 

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/",routes)

app.listen(port, () =>
    console.log(`Server is successfully running on port ${port}`)
);

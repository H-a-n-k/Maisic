import "express-async-errors";
import errorHandler from './middleware/errorHandler';
import express, { urlencoded } from 'express'
import router from './routes';
import cookieParser from "cookie-parser";
import cors from 'cors'

const app = express();
app.use(express.json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser());
app.use(cors())

app.use('/api', router)

app.get('*', (req, res) => { 
    res.status(404).json('route not found');
})
app.use(errorHandler)


const PORT = 5000;
app.listen(PORT, () => { 
    console.log('on port ' + PORT);
})
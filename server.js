import express from 'express';
import './db/conn.js';
import authRouter from './router/auth.js'
import cookieParser from 'cookie-parser';


const app = express();

app.use(express.json());
app.use(cookieParser()) ;


app.use('/', authRouter)


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server is running at port no ${PORT}`)
})
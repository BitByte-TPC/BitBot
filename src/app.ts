import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Endpoint to check if bot is online or not via uptimebot
const app = express();
app.get('/', (req: Request, res: Response) => {
    console.log(Date.now() + ' Ping Received');
    res.sendStatus(200);
});


require('./client');
module.exports = app;

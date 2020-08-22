'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const winston = require('winston')
const consoleTransport = new winston.transports.Console()
const myWinstonOptions = {
    transports: [consoleTransport]
}
const logger = new winston.createLogger(myWinstonOptions)

const stockInfo = require('./stock-info');

let port = process.env.PORT || 7777;
let app = express();

app.use(
    cors(),
    bodyParser.urlencoded({extended:true}),
    bodyParser.json()
);
app.listen(port,logger.info(`Server running, listening on port ${port}`));

app.post('/getStockDetails',async (req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    stockInfo.dialogflowFirebaseFulfillment(req,res);
});

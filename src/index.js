'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const stockInfo = require('./stock-info');

let port = process.env.PORT || 7777;
let app = express();

app.use(
    cors(),
    bodyParser.urlencoded({extended:true}),
    bodyParser.json()
);
app.listen(port,console.info("Server running, listening on port ", port));

app.post('/getStockDetails',async (req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    stockInfo.dialogflowFirebaseFulfillment(req,res);
});

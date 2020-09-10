'use strict';

const https = require('https');
require("datejs")

const winston = require('winston');
const consoleTransport = new winston.transports.Console();
const myWinstonOptions = {
    transports: [consoleTransport]
}
const logger = new winston.createLogger(myWinstonOptions);

exports.dialogflowFirebaseFulfillment = ((request, response) => {

    const action = request.body.queryResult.action;

    if (action != 'input.getStockPrice') {
        return response.status(200).send(buildChatResponse("I'm sorry, I don't know this"));
    }

    const parameters = request.body.queryResult.parameters;

    const companyName = parameters['company_name'];
    const priceType = parameters['price_type'];
    const date = parameters['date']

    return getStockPrice(companyName, priceType, date, response);
});



function getStockPrice(companyName, priceType, date, finalResponse) {

    const tickerMap = {
        "apple": "AAPL",
        "microsoft": "MSFT",
        "ibm": "IBM",
        "google": "GOOG",
        "facebook": "FB",
        "amazon": "AMZN"
    };

    const priceMap = {
        "opening": "open_price",
        "closing": "close_price",
        "maximum": "high_price",
        "high": "high_price",
        "low": "low_price",
        "minimum": "low_price"
    };

    const stockTicker = tickerMap[companyName.toLowerCase()];
    const priceTypeCode = priceMap[priceType.toLowerCase()];

    const API_KEY = 'OjBmODdiMzFjNjIxMDcwOTZiY2E3MmRjODUwMGNiNDc0';
    const PATH_STRING = `/historical_data?api_key=${API_KEY}&ticker=${stockTicker}&item=${priceTypeCode}&start_date=${date}&end_date=${date}`;

    https.get({
        host: "api.intrinio.com",
        path: PATH_STRING
    }, function (response) {
        let json = "";
        response.on('data', function (chunk) {
            logger.info("Received json response: " + chunk);
            json += chunk;
        });

        response.on('end', function () {
            let jsonData = JSON.parse(json);

            let stockPrice = jsonData.data[0] && jsonData.data[0].value;

            let chat = `Couldn't find ${priceType} price for ${companyName} on ${(new Date(date)).toString("yyyy-MM-dd")}`;
            if (stockPrice != undefined) {
                chat = "The " + priceType + " price for " + companyName + " on " + (new Date(date)).toString("yyyy-MM-dd") + " was " + stockPrice;
            }
            logger.info("Fulfillment response: " + chat);
            return finalResponse.status(200).send(buildChatResponse(chat));
        });
    });
}

function buildChatResponse(chat) {
    const responseJson = {
        "fulfillmentMessages": [
            {
                "text": {
                    "text": [
                        chat
                    ]
                }
            }
        ]
    }
    return JSON.stringify(responseJson);
}











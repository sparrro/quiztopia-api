
const { db } = require("../../database/index");
const {} = require("@aws-sdk/lib-dynamodb");
const { sendResponse, sendError } = require("../../responses/index");
const middy = require("@middy/core");
const { authenticate } = require("../../middy");

const createQuizHandler = async (event) => {

}

exports.handler = middy(createQuizHandler).use(authenticate);
const { db } = require("../../database/index");
const {} = require("@aws-sdk/lib-dynamodb");
const { sendResponse, sendError } = require("../../responses/index");
const middy = require("@middy/core");
const { authenticate } = require("../../middy");

const addQuestionsHandler = async (event) => {

}

exports.handler = middy(addQuestionsHandler).use(authenticate);
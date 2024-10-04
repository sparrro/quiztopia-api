
const { db } = require("../../database/index");
const { ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { sendResponse, sendError } = require("../../responses/index");

exports.handler = async (event) => {
    
    try {

        const scanCommand = new ScanCommand({
            TableName: "quizzes",
            ProjectionExpression: "quizId, quizName, quizOwner"
        })

        const quizzes = (await db.send(scanCommand)).Items;

        return sendResponse(200, "Quizzes retrieved", quizzes);

    } catch (error) {
        console.error(error);
        return sendError(500, "Server error");
    }

}
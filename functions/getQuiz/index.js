
const { db } = require("../../database/index");
const { QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { sendResponse, sendError } = require("../../responses/index");

exports.handler = async (event) => {
    
    const id = event.queryStringParameters["id"];

    try {

        const queryCommand = new QueryCommand({
            TableName: "quizzes",
            KeyConditionExpression: "quizId = :quizId",
            ExpressionAttributeValues: {
                ":quizId": id,
            },
        });

        const quiz = (await db.send(queryCommand)).Items[0];

        return sendResponse(200, "Quiz retrieved", quiz)

    } catch (error) {
        console.error(error);
        return sendError(500, "Server error");
    }

}
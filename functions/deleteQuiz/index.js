
const { db } = require("../../database/index");
const { DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { sendResponse, sendError } = require("../../responses/index");
const middy = require("@middy/core");
const { authenticate } = require("../../middy/index");

deleteQuizHandler = async (event) => {

    //ta in data
    const id = event.queryStringParameters["id"];

    //kör
    try {

        const deleteCommand = new DeleteCommand({
            TableName: "quizzes",
            Key: { quizId: id },
        });

        await db.send(deleteCommand);

        return sendResponse(200, "Quiz deleted");

    } catch (error) {
        console.error(error);
        return sendError(500, "Server error");
    }


}

exports.handler = middy(deleteQuizHandler).use(authenticate);
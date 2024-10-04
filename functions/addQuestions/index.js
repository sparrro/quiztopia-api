const { db } = require("../../database/index");
const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { sendResponse, sendError } = require("../../responses/index");
const middy = require("@middy/core");
const { authenticate, validateQuestions } = require("../../middy");

const addQuestionsHandler = async (event) => {

    //ta in data
    const id = event.queryStringParameters["id"];
    const { quizQuestions } = JSON.parse(event.body);

    //kör
    try {

        const updateCommand = new UpdateCommand({
            TableName: "quizzes",
            Key: { quizId: id },
            UpdateExpression: "SET questions = list_append(if_not_exists(questions, :emptyArray), :newQuestions)",
            ExpressionAttributeValues: {
                ":newQuestions": quizQuestions,
                ":emptyArray": [],
            },
        });

        await db.send(updateCommand);

        return sendResponse(200, "Questions added");

    } catch (error) {
        console.error(error);
        return sendError(500, "Server error");
    }

}


exports.handler = middy(addQuestionsHandler).use(authenticate).use(validateQuestions);
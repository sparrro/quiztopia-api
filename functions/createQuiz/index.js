
const { db } = require("../../database/index");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const { sendResponse, sendError } = require("../../responses/index");
const middy = require("@middy/core");
const { authenticate, validateQuestions } = require("../../middy");
const { v4: uuidv4 } = require("uuid");

const createQuizHandler = async (event) => {

    const user = event.user;
    const { quizName, quizQuestions } = JSON.parse(event.body);

    try {

        const id = uuidv4();
        const putCommand = new PutCommand({
            TableName: "quizzes",
            Item: {
                owner: user,
                name: quizName,
                questions: quizQuestions,
                quizId: id,
            },
        });
        await db.send(putCommand);

        return sendResponse(201, "Quiz created");

    } catch (error) {
        console.error(error);
        return sendError(500, "Server error");
    }

}

exports.handler = middy(createQuizHandler).use(authenticate).use(validateQuestions);
const isValidCoordinates = require("is-valid-coordinates");
const { sendError, sendResponse } = require("../responses");
const { validateToken } = require("../utils/jwt");
const { QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { db } = require("../database/index");

exports.authenticate = {
    before: async (handler) => {
        
        //ta in tokenen
        const authorization = handler.event.headers["authorization"];
        const token = authorization && authorization.split(" ")[1];
        if (!token) return sendError(401, "No valid token provided");

        //validera
        const validated = validateToken(token);

        //kolla om man äger quizzet man försöker pilla på
        let id
        if (handler.event.queryStringParameters) {
            id = handler.event.queryStringParameters["id"]
        };
        if (typeof id === "string") {
            const queryCommand = new QueryCommand({
                TableName: "quizzes",
                KeyConditionExpression: "quizId = :quizId",
                ExpressionAttributeValues: {
                    ":quizId": id,
                },
            });
            const quizResult = await db.send(queryCommand);
            if (quizResult.Items.length === 0) return sendError(404, "No quiz found");
            if (validated.user !== quizResult.Items[0].quizOwner) return sendError(403, "Can only edit or delete own quizzes");
        }

        handler.event.user = validated.user;
    }
}

exports.validateQuestions = {
    before: async (handler) => {

        const body = typeof handler.event.body === "string" ? JSON.parse(handler.event.body) : handler.event.body; //????? funkar det så funkar det
        const questions = body.quizQuestions

        if (!Array.isArray(questions)) return sendError(400, "Questions must be in an array");

        let problems = 0;
        questions.forEach((question) => {
            if (typeof question.question !== "string") errorMsg++;
            if (typeof question.answer !== "string") errorMsg++;
            const longitude = parseFloat(question.coordinates.longitude);
            const latitude = parseFloat(question.coordinates.latitude);
            if (isNaN(longitude) || isNaN(latitude) || !isValidCoordinates(longitude, latitude)) errorMsg++;
        });

        if (problems > 0) return sendError(400, "All questions must include a question, an answer, and a set of valid coordinates");

    }
}
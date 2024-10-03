const { db } = require("../../database/index");
const { QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { sendResponse, sendError } = require("../../responses/index");
const { checkPassword } = require("../../utils/bcrypt");
const { giveToken } = require("../../utils/jwt");

exports.handler = async (event) => {
    
    //ta in data
    const { username, password } = JSON.parse(event.body);

    //validera data
    if (!username || !password) return sendError(406, "Missing input data");

    //kör skiten
    try {

        //hitta användaren
        const usernameQueryComm = new QueryCommand({
            TableName: "users",
            KeyConditionExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username,
            },
        });
        const queryResult = await db.send(usernameQueryComm);
        if (queryResult.Items.length===0) return sendError(404, "No user by that username");

        //kolla att lösenordet stämmer
        const passwordMatches = await checkPassword(password, user.password);
        if (!passwordMatches) return sendError(401, "Incorrect password");

        //ge han en token
        const token = giveToken(user.username);
        return sendResponse(200, "Login successful", {token: token});

    } catch (error) {
        console.error(error);
        return sendError(500, "Server error");
    }

}
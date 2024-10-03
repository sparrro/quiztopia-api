const { db } = require("../../database/index");
const { PutCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { sendResponse, sendError } = require("../../responses/index");
const { validate } = require("email-validator");
const { hashPassword } = require("../../utils/bcrypt/index");

exports.handler = async (event) => {
    
    //ta in data
    const { username, email, password } = JSON.parse(event.body);
    if (!username || !email || !password) return sendError(406, "Missing input data");
    if (!validate(email)) return sendError(406, "Invalid email format");

    try {

        /* const scanCommand = new ScanCommand({
            TableName: "users",
            FilterExpression: "username = :username OR email = :email",
            ExpressionAttributeValues: {
                ":username": username,
                ":email": email
            },
        });
        const result = await db.send(scanCommand);
        if (result.Items.length>0) return sendError(400, "Account with this username of email already exists"); */

        //kolla att användarnamnet inte är upptaget
        const usernameQueryComm = new QueryCommand({
            TableName: "users",
            KeyConditionExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username,
            },
        });
        const usernameResult = await db.send(usernameQueryComm);
        if (usernameResult.Items.length>0) return sendError(400, "Username already in use");

        //ditto mejlen
        const emailQueryComm = new QueryCommand({
            TableName: "users",
            IndexName: "emailIndex",
            KeyConditionExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": email,
            },
        });
        const emailResult = await db.send(emailQueryComm);
        if (emailResult.Items.length>0) return sendError(400, "User already registered with this email");

        //skapa användaren
        const hashedPassword = await hashPassword(password);
        const putCommand = new PutCommand({
            TableName: "users",
            Item: {
                username: username,
                email: email,
                password: hashedPassword,
            }
        });
        db.send(putCommand);

        return sendResponse(201, "Registration succesful");

    } catch (error) {
        console.error(error);
        return sendError(500, "Server error");
    }
}
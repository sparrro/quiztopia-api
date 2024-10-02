const { db } = require("../../database/index");
const { v4: uuidv4 } = require("uuid");
const { ScanCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { sendResponse, sendError } = require("../../responses/index");
const { validate } = require("email-validator");
const { hashPassword } = require("../../utils/bcrypt/index");

exports.handler = async (event) => {
    
    //ta in data
    const { username, email, password } = JSON.parse(event.body);
    if (!username || !email || !password) return sendError(406, "Must fill in all fields");
    if (!validate(email)) return sendError(406, "Invalid email format");

    try {

        const scanCommand = new ScanCommand({
            TableName: "users",
            FilterExpression: "username = :username OR email = :email",
            ExpressionAttributeValues: {
                ":username": username,
                ":email": email
            },
        });
        const result = await db.send(scanCommand);
        if (result.Items.length>0) return sendError(400, "Account with this username of email already exists");

        const id = uuidv4();
        const hashedPassword = await hashPassword(password);
        const putCommand = new PutCommand({
            TableName: "users",
            Item: {
                username: username,
                email: email,
                password: hashedPassword,
                userId: id,
            },
            //ReturnValues: "ALL_NEW" //har inte bestämt mig än
        });
        const user = await db.send(putCommand);

        return sendResponse(201, "Registration succesful");

    } catch (error) {
        console.error(error);
        return sendError(500, "Server error");
    }
}
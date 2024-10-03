const { sendError } = require("../responses");
const { validateToken } = require("../utils/jwt");

exports.authenticate = {
    before: async (request) => {
        
        //ta in tokenen
        const authorization = request.event.headers["Authorization"];
        const token = authorization && authorization.split(" ")[1];
        if (!token) return sendError(401, "No valid token provided");

        //validera
        const validated = validateToken(token);
        request.event.user = validated.user;
    }
}
const { sendError, sendResponse } = require("../responses");
const { validateToken } = require("../utils/jwt");


exports.authenticate = () => ({
    before: async (request) => {
        
        //ta in tokenen
        const authorization = request.event.headers["authorization"];
        const token = authorization && authorization.split(" ")[1];
        if (!token) return sendError(401, "No valid token provided");

        //validera
        const validated = validateToken(token);
        return sendResponse(200, validated);
    }
})
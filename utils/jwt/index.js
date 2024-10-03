const jwt = require("jsonwebtoken");
const { sendError } = require("../../responses");

exports.giveToken = (user) => {
    return jwt.sign(
        {user: user},
        process.env.JWT_SECRET,
        {expiresIn: "24h"},
    );
}

exports.validateToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
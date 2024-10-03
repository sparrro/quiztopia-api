const jwt = require("jsonwebtoken");

module.exports.giveToken = (user) => {
    return jwt.sign(
        {user: user},
        process.env.JWT_SECRET,
        {expiresIn: "24h"},
    );
}
const bcrypt = require("bcryptjs");

module.exports.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10)
}

module.exports.checkPassword = async (password, comparandum) => {
    return await bcrypt.compare(password, comparandum)
}
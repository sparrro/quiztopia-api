const bcrypt = require("bcryptjs");

exports.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10)
}

exports.checkPassword = async (password, comparandum) => {
    return await bcrypt.compare(password, comparandum)
}
module.exports.sendResponse = (status, message, data) => {
    return {
        statusCode: status,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({"message": message, "data": data}),
    }
}

module.exports.sendError = (status, message) => {
    return {
        statusCode: status,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message)
    }
}
module.exports.sendResponse = (status, response) => {
    return {
        statusCode: status,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
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
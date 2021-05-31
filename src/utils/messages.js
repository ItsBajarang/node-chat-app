const generateMessage = (text, userName) => {
    return {
        text,
        userName,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (url, userName) => {
    return {
        url,
        userName,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}
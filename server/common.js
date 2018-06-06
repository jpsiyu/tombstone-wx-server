const MSG_SERVER_ERROR = 'Internal Server Error'
const HTML_PATH = '../client/public'

const serverMsg = (res, statusCode, ok, message, data) => {
    const m = {
        ok,
        message,
        data
    }
    console.log(m)
    res.status(statusCode).json(m)
}
const serverErrMsg = res => serverMsg(res, 500, false,  MSG_SERVER_ERROR, null) 

module.exports = {
    MSG_SERVER_ERROR,
    HTML_PATH,
    serverMsg,
    serverErrMsg,
}
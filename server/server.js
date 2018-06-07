const express = require('express')
const expressValidator = require('express-validator')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const {Database} = require('./database.js')
const common = require('./common.js')
const stone = require('./stone.js')
const qs = require('querystring')
const request = require('request')

// app and middlewares 
const app = express()
app.use(express.static(path.resolve(__dirname, common.HTML_PATH)))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(morgan('tiny'))
app.use(expressValidator())

// routes

app.get('/api/stones', (req, res) => {
    stone.getStones(req, res, database)
})

app.post('/api/stone', (req, res) => {
    stone.addStone(req, res, database)
})


app.delete('/api/delete', (req, res) => {
    stone.deleteStone(req, res, database)
})

app.get('/api/openid', (req, res) => {
    const code = req.query.code
    const data = {
        appid: 'wx2c7cf40466bd799e',
        secret: '318c828a64a576ffca56f7fed4079491',
        js_code: req.query.code,
        grant_type: 'authorization_code',
    }
    const content = qs.stringify(data)

    const options = {
        protocol:'https:',
        port: 443,
        hostname: 'https://api.weixin.qq.com',
        path: '/sns/jscode2session?' + content, 
        method: 'GET' ,
    }
    const p = options.hostname + options.path

    request(p, (error, response, body) => {
        if(error){
            common.serverMsg(res, 200, false, JSON.stringify(error), null)
        }else{
            const bodyObj = JSON.parse(body)
            common.serverMsg(res, 200, true, 'ok', {openid: bodyObj.openid})
        }
    })
})

app.use((req, res) => {
    res.type('text/plain')
    res.status(404)
    res.send('404 Not Found')
})

app.use( (error, req, res, next) => {
    console.log(error.stack)
    res.status(500)
    res.type('text/plain')
    res.send('505 Internal Server Error')
})

const database = new Database()
database.connect( () => {
    app.listen(3000, '127.0.0.1', () => console.log('server listening on 3000'))
})

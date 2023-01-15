const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const app = express()
const bot_1 = require('./internal_modules/bot_1')
const bot_2 = require('./internal_modules/bot_2')
const bot_3 = require('./internal_modules/bot_3')
const Excel = require('exceljs')

app.use(bodyParser.json())
app.use(cors())

var ultimos_numeros = [0, 0, 0, 0, 0]

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/view/public/index.html')
})

app.get('/download', (req, res) => {

})

app.post('/submit-data', (req, res) => {
    var currentDate = new Date();
    const lastNumber = parseInt(req.body.lastNum)
    const count = parseInt(req.body.valueContador) + 1
    const winBot1 = parseInt(req.body.valueWinBot1)
    const winBot2 = parseInt(req.body.valueWinBot2)
    const winBot3 = parseInt(req.body.valueWinBot3)
    const paramArrayLastFiveNumbers = req.body.arrayLastFiveNumbers

    var paramArrayToInt = paramArrayLastFiveNumbers.map((item) => {
        return parseInt(item)
    })

    ultimos_numeros = paramArrayToInt

    for (let i = 0; i < 4; i++) {
        ultimos_numeros[i] = ultimos_numeros[i + 1]
    }

    ultimos_numeros[4] = lastNumber

    let bot1_predict = bot_1.predict(lastNumber)
    let bot2_predict = bot_2.predict(lastNumber, ultimos_numeros)
    let bot3_predict = bot_3.predict(lastNumber, ultimos_numeros)

    res.status(200).json({
        last_numbers: ultimos_numeros,
        predict1: bot1_predict,
        predict2: bot2_predict,
        predict3: bot3_predict,
        rounds: count,
        win_bot1: winBot1,
        win_bot2: winBot2,
        win_bot3: winBot3,
        date_hour: currentDate
    })

});

app.use(express.static(path.join(__dirname, 'view/public')));

app.listen(8081, () => {
    console.log('Servidor Rodando na url http://localhost:8081')
})
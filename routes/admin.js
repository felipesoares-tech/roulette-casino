const express = require('express')
const router = express.Router()
const bot_1 = require('../internal_modules/bot_1')
const bot_2 = require('../internal_modules/bot_2')
const bot_3 = require('../internal_modules/bot_3')
const mongoose = require('mongoose')
require('../models/Results')
const result_bot1 = mongoose.model('result_bot1')
const result_bot2 = mongoose.model('result_bot2')
const result_bot3 = mongoose.model('result_bot3')
const Excel = require('exceljs')

var ultimos_numeros = [0, 0, 0, 0, 0]

router.get('/download', (req, res) => {

})

router.post('/array-update', (req, res) => {
    const paramArrayLastFiveNumbers = req.body.arrayLastFiveNumbers
    var paramArrayToInt = paramArrayLastFiveNumbers.map((item) => {
        return parseInt(item)
    })

    ultimos_numeros = paramArrayToInt
    let lastNumber = ultimos_numeros[4]

    var bot1_predict = bot_1.predict(lastNumber)
    var bot2_predict = bot_2.predict(lastNumber, ultimos_numeros)
    var bot3_predict = bot_3.predict(lastNumber, ultimos_numeros)

    res.status(200).json({
        last_numbers: ultimos_numeros,
        predict1: bot1_predict,
        predict2: bot2_predict,
        predict3: bot3_predict
    })
})

router.post('/submit-data', (req, res) => {
    var currentDate = new Date();
    const lastNumber = parseInt(req.body.lastNum)
    const count = parseInt(req.body.valueContador) + 1
    const winBot1 = parseInt(req.body.valueWinBot1)
    const winBot2 = parseInt(req.body.valueWinBot2)
    const winBot3 = parseInt(req.body.valueWinBot3)

    for (let i = 0; i < 4; i++) {
        ultimos_numeros[i] = ultimos_numeros[i + 1]
    }

    ultimos_numeros[4] = lastNumber

    var bot1_predict = bot_1.predict(lastNumber)
    var bot2_predict = bot_2.predict(lastNumber, ultimos_numeros)
    var bot3_predict = bot_3.predict(lastNumber, ultimos_numeros)

    result_bot1.findOneAndUpdate({}, { $inc: { rodada: 1 } }, { new: true, upsert: true, setDefaultsOnInsert: true }, (err, ret) => {
        if (err) {
            console.log('Erro ao incrementar: ' + err)
        } else {
            const ResultBot1 = {
                rodada: ret.rodada,
                previsao: bot1_predict,
                vitoria: winBot1,
            }
            new result_bot1(ResultBot1).save().then(() => {
                console.log('Dados bot1 salvos com sucesso!')
            }).catch((err) => {
                console.log('Erro ao salvar resultados do bot1 ' + err)
            })
        }
    })

    result_bot2.findOneAndUpdate({}, { $inc: { rodada: 1 } }, { new: true, upsert: true, setDefaultsOnInsert: true }, (err, ret) => {
        if (err) {
            console.log('Erro ao incrementar: ' + err)
        } else {
            const ResultBot2 = {
                rodada: ret.rodada,
                previsao: bot2_predict,
                vitoria: winBot2,
            }
            new result_bot2(ResultBot2).save().then(() => {
                console.log('Dados bot2 salvos com sucesso!')
            }).catch((err) => {
                console.log('Erro ao salvar resultados do bot2 ' + err)
            })
        }
    })

    result_bot3.findOneAndUpdate({}, { $inc: { rodada: 1 } }, { new: true, upsert: true, setDefaultsOnInsert: true }, (err, ret) => {
        if (err) {
            console.log('Erro ao incrementar: ' + err)
        } else {
            const ResultBot3 = {
                rodada: ret.rodada,
                previsao: bot3_predict,
                vitoria: winBot3,
            }
            new result_bot3(ResultBot3).save().then(() => {
                console.log('Dados bot3 salvos com sucesso!')
            }).catch((err) => {
                console.log('Erro ao salvar resultados do bot3 ' + err)
            })
        }
    })

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

})

module.exports = router
const express = require('express')
const router = express.Router()
const bot_1 = require('../internal_modules/bot_1')
const bot_2 = require('../internal_modules/bot_2')
const bot_3 = require('../internal_modules/bot_3')
const archiver = require('archiver')
const JSZip = require('jszip');
const mongoose = require('mongoose')
require('../models/Results')
const result_bot1 = mongoose.model('result_bot1')
const result_bot2 = mongoose.model('result_bot2')
const result_bot3 = mongoose.model('result_bot3')
const Excel = require('exceljs')

var ultimos_numeros = [0, 0, 0, 0, 0]

router.get('/download', async (req, res) => { //Rota para download do xlsx
    var workbook = new Excel.Workbook()

    const worksheet1 = workbook.addWorksheet('Dados Bot 1')
    const worksheet2 = workbook.addWorksheet('Dados Bot 2')
    const worksheet3 = workbook.addWorksheet('Dados Bot 3')


    const botData_1 = await result_bot1.find({}).skip(1)
    const botData_2 = await result_bot2.find({}).skip(1)
    const botData_3 = await result_bot3.find({}).skip(1)

    const count_1 = await result_bot1.countDocuments({})
    const count_2 = await result_bot2.countDocuments({})
    const count_3 = await result_bot3.countDocuments({})

    const rows_tab1 = botData_1.map(data => {
        return [data.rodada, data.previsao, data.vitoria, data.match,data.dataHora]
    })

    const table1 = worksheet1.addTable({
        ref: 'A1:D' + (count_1),
        columns: [
            { name: 'rodada', header: 'Rodada', style: { alignment: 'center' }, filterButton: true },
            { name: 'previsao', header: 'Previsao', style: { alignment: 'center' }, filterButton: true },
            { name: 'vitoria', header: 'Vitoria', style: { alignment: 'center' }, filterButton: true },
            { name: 'match', header: 'Match', style: { alignment: 'center' }, filterButton: true },
            { name: 'dataHora', header: 'DataHora', style: { alignment: 'center' }, filterButton: true }
        ],
        rows: rows_tab1,
        style: {
            theme: "TableStyleMedium9",
            showRowStripes: true,
            filterButton: true,
            alignment: 'center'
        }
    })

    const rows_tab2 = botData_2.map(data => {
        return [data.rodada, data.previsao, data.vitoria, data.match,data.dataHora]
    })
    const table2 = worksheet2.addTable({
        ref: 'A1:D' + (count_2),
        columns: [
            { name: 'rodada', header: 'Rodada', style: { alignment: 'center' }, filterButton: true },
            { name: 'previsao', header: 'Previsao', style: { alignment: 'center' }, filterButton: true },
            { name: 'vitoria', header: 'Vitoria', style: { alignment: 'center' }, filterButton: true },
            { name: 'match', header: 'Match', style: { alignment: 'center' }, filterButton: true },
            { name: 'dataHora', header: 'DataHora', style: { alignment: 'center' }, filterButton: true }
        ],
        rows: rows_tab2,
        style: {
            theme: "TableStyleMedium9",
            showRowStripes: true,
            filterButton: true,
            alignment: 'center'
        }
    })

    const rows_tab3 = botData_3.map(data => {
        return [data.rodada, data.previsao, data.vitoria, data.match,data.dataHora]
    })

    const table3 = worksheet3.addTable({
        ref: 'A1:D' + (count_3),
        columns: [
            { name: 'rodada', header: 'Rodada', style: { alignment: 'center' }, filterButton: true },
            { name: 'previsao', header: 'Previsao', style: { alignment: 'center' }, filterButton: true },
            { name: 'vitoria', header: 'Vitoria', style: { alignment: 'center' }, filterButton: true },
            { name: 'match', header: 'Match', style: { alignment: 'center' }, filterButton: true },
            { name: 'dataHora', header: 'DataHora', style: { alignment: 'center' }, filterButton: true }
        ],
        rows: rows_tab3,
        style: {
            theme: "TableStyleMedium9",
            showRowStripes: true,
            filterButton: true,
            alignment: 'center'
        }
    })

    const archive = archiver('zip', {
        zlib: { level: 9 } // Nível de compressão
    })

    res.setHeader('Content-Type', 'application/zip')
    res.setHeader('Content-Disposition', 'attachment; filename=my-excel-files.zip')

    archive.pipe(res)

    Promise.all([
        workbook.xlsx.writeBuffer()
    ]).then(([buffer1]) => {
        archive.append(Buffer.from(buffer1), { name: 'data.xlsx' });
        archive.finalize()
    })
})

router.post('/array-update', (req, res) => { //Rota para atualizar o array ("Inserir 5 ultimo número")  
    const paramArrayLastFiveNumbers = req.body.arrayLastFiveNumbers //Busca o parâmetro passado
    var paramArrayToInt = paramArrayLastFiveNumbers.map((item) => { // Converte valores para inteiro
        return parseInt(item)
    })

    ultimos_numeros = paramArrayToInt // atualiza o array

    var bot1_predict = bot_1.predict(ultimos_numeros[4])    /*ultimos_numeros[4] -> Ultimo número do array*/
    var bot2_predict = bot_2.predict(ultimos_numeros[4], ultimos_numeros)
    var bot3_predict = bot_3.predict(ultimos_numeros[4], ultimos_numeros)

    res.status(200).json({ //Devolve uma respota ao cliente
        last_numbers: ultimos_numeros,
        predict1: bot1_predict,
        predict2: bot2_predict,
        predict3: bot3_predict
    })
})

router.post('/collect-off', (req, res) => {
    var currentDate = new Date();
    const lastNumber = parseInt(req.body.lastNum)
    const count = parseInt(req.body.valueContador) + 1
    const winBot1 = parseInt(req.body.valueWinBot1)
    const winBot2 = parseInt(req.body.valueWinBot2)
    const winBot3 = parseInt(req.body.valueWinBot3)

    for (let i = 0; i < 4; i++) {                   //Anda com a fila no array
        ultimos_numeros[i] = ultimos_numeros[i + 1]
    }

    ultimos_numeros[4] = lastNumber //Adiciona o ultimo numero informado na ultima posição

    var bot1_predict = bot_1.predict(lastNumber)
    var bot2_predict = bot_2.predict(lastNumber, ultimos_numeros)
    var bot3_predict = bot_3.predict(lastNumber, ultimos_numeros)

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

router.post('/submit-data', (req, res) => { //Rota para tratamento de dados
    var currentDate = new Date();
    const lastNumber = parseInt(req.body.lastNum)
    const count = parseInt(req.body.valueContador) + 1
    const winBot1 = parseInt(req.body.valueWinBot1)
    const winBot2 = parseInt(req.body.valueWinBot2)
    const winBot3 = parseInt(req.body.valueWinBot3)

    for (let i = 0; i < 4; i++) {                   //Anda com a fila no array
        ultimos_numeros[i] = ultimos_numeros[i + 1]
    }

    ultimos_numeros[4] = lastNumber //Adiciona o ultimo numero informado na ultima posição

    var bot1_predict = bot_1.predict(lastNumber)
    var bot2_predict = bot_2.predict(lastNumber, ultimos_numeros)
    var bot3_predict = bot_3.predict(lastNumber, ultimos_numeros)
    let checkArrays = [bot1_predict, bot2_predict, bot3_predict]
    var match = checkArrays.every((array) => JSON.stringify(array) === JSON.stringify(bot1_predict))
    
    result_bot1.findOneAndUpdate({}, { $inc: { rodada: 1 } }, { new: true, upsert: true, setDefaultsOnInsert: true }, (err, ret) => {
        if (err) {
            console.log('Erro ao incrementar: ' + err)
        } else {
            const ResultBot1 = {
                rodada: ret.rodada,
                previsao: `${bot1_predict[0]},${bot1_predict[1]}`,
                match: match,
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
                previsao: `${bot2_predict[0]},${bot2_predict[1]}`,
                match: match,
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
                previsao: `${bot3_predict[0]},${bot3_predict[1]}`,
                match: match,
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
        predict1: `${bot1_predict[0]},${bot1_predict[1]}`,
        predict2: `${bot2_predict[0]},${bot2_predict[1]}`,
        predict3: `${bot3_predict[0]},${bot3_predict[1]}`,
        rounds: count,
        match: match,
        win_bot1: winBot1,
        win_bot2: winBot2,
        win_bot3: winBot3,
        date_hour: currentDate
    })

})

module.exports = router
const mongoose = require('mongoose')
const { numberToDate } = require('xlsx-populate/lib/dateConverter')
const Schema = mongoose.Schema

const ResultBot1 = new Schema({
    rodada: {
        type: Number,
        require: true
    },
    previsao: {
        type: String,
        require: true
    },
    vitoria: {
        type: Boolean,
        require: true
    },
    linha: {
        type: Number,
        require: true
    },
    match: {
        type: Boolean,
        require: false
    },
    dataHora: {
        type: Date,
        default: Date.now,
        require: true
    }
})

const ResultBot2 = new Schema({
    rodada: {
        type: Number,
        require: true
    },
    previsao: {
        type: String,
        require: true
    },
    vitoria: {
        type: Boolean,
        require: true
    },
    linha: {
        type: Number,
        require: true
    },
    match: {
        type: Boolean,
        require: false
    },
    dataHora: {
        type: Date,
        default: Date.now,
        require: true
    }
})

const ResultBot3 = new Schema({
    rodada: {
        type: Number,
        require: true
    },
    previsao: {
        type: String,
        require: true
    },
    vitoria: {
        type: Boolean,
        require: true
    },
    linha: {
        type: Number,
        require: true
    },
    match: {
        type: Boolean,
        require: false
    },
    dataHora: {
        type: Date,
        default: Date.now,
        require: true
    }
})

mongoose.model('result_bot1', ResultBot1)
mongoose.model('result_bot2', ResultBot2)
mongoose.model('result_bot3', ResultBot3)
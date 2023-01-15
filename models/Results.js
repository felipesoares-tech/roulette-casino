const mongoose = require('mongoose')
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
    dataHora: {
        type: Date,
        default: Date.now,
        require: true
    }
})
ResultBot1.plugin(autoIncrement.plugin, { model: 'result_bot1', field: 'id' });
mongoose.model('result_bot1', ResultBot1)
mongoose.model('result_bot2', ResultBot2)
mongoose.model('result_bot3', ResultBot3)
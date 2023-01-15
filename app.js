const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
const admin = require('./routes/admin')

//Express
const app = express()

//Body Parser
app.use(bodyParser.json())

//Cors
app.use(cors())

//Mongoose
mongoose.connect('mongodb://127.0.0.1/roulette_casino').then(()=>{
    console.log('MongoDb Conectado..')
}).catch((err)=>{
    console.log('Erro ao se conectar ao mongoDB: '+err)
})

//Public
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/view/layouts/index.html')
})

app.use('/admin', admin)

app.listen(8081, () => {
    console.log('Servidor Rodando na url http://localhost:8081')
})
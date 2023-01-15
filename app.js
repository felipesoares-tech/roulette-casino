const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const app = express()
const admin = require('./routes/admin')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/view/layouts/index.html')
})

app.use('/admin', admin)

app.listen(8081, () => {
    console.log('Servidor Rodando na url http://localhost:8081')
})
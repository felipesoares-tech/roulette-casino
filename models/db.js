const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1/roulette_casino').then(()=>{
    console.log('MongoDb Conectado..')
}).catch((err)=>{
    console.log('Erro ao se conectar ao mongoDB: '+err)
})
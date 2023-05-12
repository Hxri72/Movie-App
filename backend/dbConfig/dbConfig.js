const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/movie-app')

const connection = mongoose.connection

connection.on('connected',()=>{console.log('DB is connected')})

connection.on('error',()=>{console.log('DB is not connected')})
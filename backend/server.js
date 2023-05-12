const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path');

require('./dbConfig/dbConfig')

app.use(cors())
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'assets')));

const movieRouter = require('./routes/route')

app.use('/api',movieRouter)

app.listen(5000,()=>{
    console.log('server is running')
})
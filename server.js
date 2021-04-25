const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts');
require('./config/database')
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index')
const playerRouter = require('./routes/players')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

app.use('/', indexRouter)
app.use('/players', playerRouter)

app.listen(process.env.PORT || 3000)
const express = require('express');
const app = express();
const routes = require('./routes/index')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(routes)

app.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Route Not Found'
  })
})

module.exports = app

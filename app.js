const express = require('express')
const app = express()
const port = 3000

//setting router
app.get('/', (req, res) => {
    res.send('GET')
})

app.listen(port, () => {
    console.log('To-do List is running on port' , port)
})
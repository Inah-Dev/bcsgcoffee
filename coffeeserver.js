
const express = require('express')
var ifs = require('os').networkInterfaces();

const app = express()
const port = 3000

var address = Object.keys(ifs)
  .map(x => ifs[x].filter(x => x.family === 'IPv4' && !x.internal)[0])
  .filter(x => x)[0].address;

app.get('/', (req, res) => {
    res.type('text/html')
    res.send(serveCoffee())
})

app.get('/coffee', (req, res) => {
    res.type('text/html')
    res.send(serveCoffee('coffee'))
})

app.get('/tea', (req, res) => {
    res.type('text/html')
    res.send(serveCoffee('tea'))
})

app.use((req, res) => {
    res.type('text/html')
    res.status(404)
    res.send(serveCoffee('error'))
})
app.listen(port, (req,res) => {

    console.log("BCSG Coffee service running  on: http://%s:%s", address, port);
})

function serveCoffee(type = undefined){
    const tea = require('./tea');
    const coffee = require('./coffee');

    let cup = undefined
    let message = undefined
    if(type === undefined){
         cup = `&#9832;`
         message = `Welcome to BCSG Coffee Shop!`
    }
    else if(type === "tea"){
        cup = tea.serveTeaCup()
        message = tea.serveTeaMessage()
    }
    else if(type === "coffee"){
        cup = coffee.serveCoffeeCup()
        message = coffee.serveCoffeeMessage()
    }
    else{
        cup =`&#129335;`
        message = "Not available"
    }
    message = `${message}<br>You are being served by: ${address}:${port}`

    let contentPayload = `    
    <html>
    <head>
    <style>
    div {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
    </style>
    </head>
    <body>
    <div style="font-size:80">
    <center><b style="font-size:400">${cup}</b> <br>${message}</center></div>
    </body>
    </html>`

    return contentPayload
}
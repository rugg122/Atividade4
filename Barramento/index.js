const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const eventos = [];

app.post("/eventos", async(req, res) => {
    console.log('Barreamento');
    const evento = req.body;
    eventos.push(evento);
    
    axios.post("http://localhost:4000/eventos", evento);
    
    axios.post("http://localhost:5000/eventos", evento);
    
    axios.post("http://localhost:6000/eventos", evento);
    
    axios.post("http://localhost:7000/eventos", evento);

    res.status(200).send({
        msg: "Tudo Okay"
    });
});

app.get('/eventos', (req, res) => {
    res.send(eventos);
});

app.listen(10000, () => {
    console.log('barramento de eventos Porta 10000.')
})
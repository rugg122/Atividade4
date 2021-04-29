const express = require ('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const ingressosPorClienteId = {};
cont = 0;

const {
    v4: uuidv4
} = require('uuid');

const funcoes = {
    CliIngressoDel: (dados) => {
        console.log("Cliente deletado")
        delete ingressosPorClienteId[dados.id];
    }
};

app.get('/clientes/:id/ingresso', (req, res) => {
    res.send(ingressosPorClienteId[req.params.id] || []);

});

app.get('/ingresso', (req, res) => {
    res.send(ingressosPorClienteId || []);

});

app.post("/eventos", (req, res) => {
    try {
        funcoes[req.body.tipo](req.body.dados);
    } catch (err) {}
    res.status(200).send(baseConsulta);
});

app.post('/clientes/:id/ingresso', async(req, res) => {
    const idObs = uuidv4();
    const {
        descricao
    } = req.body;
    const ingressosDoCliente =
        ingressosPorClienteId[req.params.id] || [];
    ingressosDoCliente.push({
        id: idObs,
        descricao
    });
    ingressosPorClienteId[req.params.id] =
        ingressosDoCliente;
    await axios.post('http://localhost:10000/eventos', {
        tipo: "IngressoCriado",
        dados: {
            id: idObs,
            descricao,
            clienteId: req.params.id
        }
    })
    res.status(201).send(ingressosDoCliente);
});


app.delete('/clientes/:id/ingresso', (req, res) => {
    const idDeletar = req.params.id;
    const length = ingressosPorClienteId[req.params.id].length
    ingressosPorClienteId[req.params.id].splice(length-1, 1)
    axios.post("http://localhost:10000/eventos", {
        tipo: "IngressoDeletado",
        dados: idDeletar
    });
    res.send(ingressosPorClienteId[req.params.id] || []);
})
app.listen(5000, (() => {
    console.log('ingresso. Porta 5000');
}));
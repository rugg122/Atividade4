const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());
const baseConsulta = {};

const funcoes = {

    ClienteCadastrado: (cli) => {
        console.log("Entrou no cli Criado")

        if (Object.keys(baseConsulta).length === 0){
            baseConsulta[cli.cont] = cli;
            baseConsulta[cli.cont]["ingresso"] = [];
        } 
        
        else if (baseConsulta[cli.cont] != null && baseConsulta[cli.cont]["ingresso"].length > 0){
            const ingresso = baseConsulta[cli.cont]["ingresso"];
            baseConsulta[cli.cont] = cli;
            baseConsulta[cli.cont]["ingresso"] = ingresso;
        } 
        
        else {
            baseConsulta[cli.cont] = cli;
            baseConsulta[cli.cont]["ingresso"] = [];
        }
    },

    ClienteDel: (id) => {
        console.log("Entrou no cli Deletado");
        axios.post('http://localhost:10000/eventos', {
                tipo: "CliIngressoDel",
                dados: {
                    id: id 
                }
        });
        delete baseConsulta[id];
    }, 

    IngressoCriado: (ingressos) => {
        console.log("Entrou no Ingresso Criado")
        const ingresso = 
            baseConsulta[ingresso.clienteId]["ingresso"] || [];
            ingresso.push(ingresso);
            baseConsulta[ingresso.clienteId]["ingresso"] = 
            ingresso;
            baseConsulta[ingresso.clienteId].qtdIngresso = 
            ingresso.length;

        axios.post('http://localhost:10000/eventos', {
                tipo: "IngressoCliente",
                dados: {
                    id: ingresso.clienteId,
                    quant: baseConsulta[ingresso.clienteId].qtdIngresso
                }
        });
    },

    IngressoDeletado: (id) => {

        console.log("Ingresso Deletado")
        const len = baseConsulta[id]["ingresso"].length;
        baseConsulta[id]["ingresso"].splice(len-1, 1)
        baseConsulta[id].qtdIngresso = baseConsulta[id]["ingresso"].length;

        axios.post('http://localhost:10000/eventos', {
                tipo: "IngressoCliente",
                dados: {
                    id: id,
                    quant: baseConsulta[id].qtdIngresso
                }
        });
    },
};

app.get("/consulta", (req, res) => {
    axios.get("http://localhost:4000/clientes").then((result) => {    
    res.status(200).json(result.data)
    })
});

app.post("/eventos", (req, res) => {
    try {
        funcoes[req.body.tipo](req.body.dados);
    } catch (err) {}
    res.status(200).send(baseConsulta);
});

app.listen(6000, async() => {
    console.log("consultas Porta 6000");
});
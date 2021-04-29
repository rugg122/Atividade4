const express = require("express");
const axios = require("axios")
const app = express();
app.use(express.json());

const preferencia = 60;

const funcoes = {
    CliClassificado: (cli) => {
        cli.status =
            cli.idade >= preferencia ?
            "prioritario" :
            "comum";

        axios.post("http://localhost:10000/eventos", {
            tipo: "ClienteClassificado",
            dados: {
                cont: cli.cont,
                nome: cli.nome,
                end: cli.end,
                idade: cli.idade,
                status: cli.status,
                quantIngressos: cli.quantIngressos
            }
        });
    },
};

app.post('/eventos', (req, res) => {
    try {
        funcoes[req.body.tipo](req.body.dados);
    } catch (err) 
    {
        
    }
    res.status(200).send({ msg: "Ok" });
});

app.listen(7000, () => console.log("classificação Porta 7000"));
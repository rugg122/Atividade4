const express = require('express');
const app = express();
app.use(express.json());
const axios = require("axios");

let clientes =[{
    id: 1,
    nome:'Sandro',
    endereco : 'rua y',
    idade: 21,
    status: ''
},

{
    id: 2,
    nome:'Paulo',
    endereco : 'rua x',
    idade: 58,
    status: '' 
    
}];

let id=clientes.length;
app.get('/clientes',(req,res,next)=>{
    console.log("ok")
    res.status(200).json(clientes);
});

app.post('/eventos', (req,res,next)=>{
    console.log(req.body);
    res.status(200).send({ msg: "ok" });    
});

app.delete('/clientes/:id',(req,res,next)=>{
    let newClientes=[];
    let idCliente = req.params.id
    for(let cliente of clientes){
        if(cliente.id != idCliente)
        {
          cliente.id = newClientes.length + 1;
          newClientes.push(cliente);
        }

    }
    id = newClientes.length;
    clientes =  newClientes;
    res.status(200).json(clientes);
});

app.put('/clientes', async (req,res,next)=>{
    const cliente = {
        id : id+1,
        nome:req.body.nome,
        endereco:req.body.endereco,
        idade:req.body.idade,
        status:'aguardando...'
    }
    clientes.push(cliente);
    id += 1;
    await axios.post("http://localhost:10000/eventos", {
    tipo: "ClienteCadastrado",
    dados: {
     id : id+1,
     nome : req.body.nome,
     endereco:req.body.endereco,
     idade:req.body.idade,
     status:'aguardando...'
          },
     });
    res.status(201).json(clientes);
});

app.listen(4000, ()=>{
    console.log('Escutando porta 4000');
})
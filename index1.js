const bodyParser = require("body-parser");
const express = require("express");
const { Blockchain } = require("./blockchain");

const app = express();
const PORT = 3000;

const blockchain = new Blockchain();

app.use(bodyParser.json());

app.get("/api/blocks22", (req , res) => {
    res.json(blockchain.chain);
});

app.post("/api/mine22" , (req , res) => {
    const {data} = req.body;

    blockchain.addBlock({data});
    res.redirect("/api/blocks22");
}); 

app.listen(PORT , () => {
    console.log(`listening to PORT : ${PORT}`);
}); 
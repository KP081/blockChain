const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const { Blockchain } = require("./blockchain");
const { PubSub } = require("./publishSuscribe");

const app = express();

const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
setTimeout(() => pubsub.broadcastChain() , 1000);

app.use(bodyParser.json());

app.get("/api/blocks22", (req , res) => {
    res.json(blockchain.chain);
});

app.post("/api/mine22" , (req , res) => {
    const {data} = req.body;

    blockchain.addBlock({data});
    pubsub.broadcastChain();
    res.redirect("/api/blocks22");
}); 

const synChain = () => {
    request({url:`${ROOT_NODE_ADDRESS}/api/blocks22`} ,
         (error , response , body) => {
            if(!error && response.statusCode === 200){
            const rootChain = JSON.parse(body);
            console.log("replace chain on sync with : ",rootChain);
            blockchain.replaceChain(rootChain);
            }
        }
    );
};

let PEER_PORT;

if(process.env.GENERATE_PEER_PORT === "true") {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT , () => {
    console.log(`listening to PORT : ${PORT}`);
    synChain();
}); 
const hexToBinary = require('hex-to-binary');
const {GENESIS_DATA , MINE_RATE} = require('./config');
const {cryptoHash} = require('./crypto_hash');

class Block {
    constructor({timestamp , prevHash , hash , data , nonce , difficulty}){
        this.timestamp = timestamp;
        this.prevHash = prevHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static genesis(){
        return new this(GENESIS_DATA)
    }

    static mineBlock({prevBlock , data}) {
        let hash , timestamp;
        const prevHash = prevBlock.hash;
        let { difficulty } = prevBlock;
        let nonce = 0;

        do{
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDiffculty({
                originalBlock : prevBlock,
                timestamp,
            }); 
            hash = cryptoHash(timestamp , prevHash , data , nonce , difficulty);
        }
        while(hexToBinary(hash).substring(0 , difficulty) !== "0".repeat(difficulty));

        return new this({
            timestamp ,
            prevHash , 
            data , 
            nonce , 
            difficulty,
            hash
        });
    }

    static adjustDiffculty({originalBlock , timestamp}){
        const { difficulty } = originalBlock;

        if(difficulty < 1) return 1;

        const difference = timestamp - originalBlock.timestamp;

        if(difference > MINE_RATE) return difficulty - 1 ;
        return difficulty + 1;
    }
}

const block1 = new Block({
    timestamp : "02/04/24" ,
    prevHash : "0a4b56" ,
    hash :  "0xc12" ,
     data : "kathan"
});

module.exports = {Block}
// const genesisBlock = Block.genesis();
// console.log(genesisBlock);

// const result = Block.mineBlock({ prevBlock : block1 , data : "block2" });
// console.log(result);
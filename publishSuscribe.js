const redis = require("redis");

const CHANNELS = {
    TEST : 'TEST',
    BLOCKCHAIN : 'BLOCKCHAIN'
}

class PubSub {
    constructor({blockchain}) {
        this.blockchain = blockchain;
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscriber.subscribe(CHANNELS.TEST);
        this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);

        this.subscriber.on("message" , (channel , message) => this.handelMessage(channel , message))
    }

    handelMessage(channel , message) {
        console.log(`Message recived.channel : ${channel} , Message : ${message}`);
        const parseMessage = JSON.parse(message);
        
        if(channel === CHANNELS.BLOCKCHAIN){
            this.blockchain.replaceChain(parseMessage);
        }
    }

    publish({channel , message}){
        this.publisher.publish(channel , message);
    }

    broadcastChain() {
        this.publish({
            channel : CHANNELS.BLOCKCHAIN,
            message : JSON.stringify(this.blockchain.chain),
        })
    }
}

// const checkPubSub = new PubSub();

// setTimeout(
//     () => checkPubSub.publisher.publish(CHANNELS.TEST , "hellooooo"),
//     1000
// );

module.exports = { PubSub };
const INITIAL_DIFFICULTY = 2
const MINE_RATE = 1000 // ms

const GENESIS_DATA = {
    timestamp : 1,
    prevHash : '0x000',
    hash : '0x123',
    data : [],
    nonce : 0,
    difficulty : INITIAL_DIFFICULTY,
}

module.exports = {GENESIS_DATA};
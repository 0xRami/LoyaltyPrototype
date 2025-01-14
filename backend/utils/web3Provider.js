const { Web3 } = require('web3');
require('dotenv').config();

const web3 = new Web3(process.env.RPC_URL);
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

module.exports = {
    web3,
    account
};
// deploy code will go here
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const compiledFactory = require('./build/CampaignFactory.json');

const mnemonicPhrase = "oval december fine satisfy avoid expire make wish ethics swallow faint dose";

let provider = new HDWalletProvider(
    {
    mnemonic:{
        phrase: mnemonicPhrase
    },
    providerOrUrl: "https://rinkeby.infura.io/v3/0e2b8d32e5fc4bd7990e63a5fe8f8c0a"
    }
);

const web3 = new Web3(provider);

const deploy = async () => {

 accounts = await web3.eth.getAccounts();

 console.log('Attempting to deploy from account',accounts[0]);

    // Contract Creation

     const results = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
        data: compiledFactory.evm.bytecode.object,
    })
    .send({from : accounts[0],gas: '5000000'});

    console.log('Contract deployed to ', results.options.address);
    provider.engine.stop();

}


deploy();



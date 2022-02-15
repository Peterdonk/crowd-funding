const assert = require('assert');
const Web3 = require('web3');

// Provider
const web3 = new Web3(
"HTTP://127.0.0.1:7545"
);


const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let campaignFactoryContract;
let campaignAddress;
let campaignContract;


beforeEach(async () => {
    // Get all accounts from Ganache
    accounts = await web3.eth.getAccounts();

    // Create campaignFactory Contract
    campaignFactoryContract = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ from: accounts[0], gas: '5000000' });
    
    
    // Initialize create campaign function
    await campaignFactoryContract.methods.createCampaign('100').send({ from: accounts[0], gas: '5000000' });


    // Assign Address to variable
    [campaignAddress] = await campaignFactoryContract.methods.getAllDeployedCampaigns().call({
        from: accounts[0],
        gas: '1000000'
    });

    
    // Create Campaign Contract With Address From Campaign Factory
    campaignContract = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);

});



describe('Campaigns', () => {
    
    it('Deploys a factory and a campaign', () => {
        assert.ok(campaignFactoryContract.options.address);
        assert.ok(campaignContract.options.address);
    });




    it('marks caller as the campaign manager', async () => {
        const manager = await campaignContract.methods.managersAddress().call();
        assert.equal(accounts[0], manager);

    });



    it('allows people to contribute money and marks them as approvers', async () => {
        await campaignContract.methods.contribute().send(
            { from: accounts[1], value: '200' });
        
        const isContributor = await campaignContract.methods.approvers(accounts[1]).call();
        assert.equal(isContributor, true);
    })


    it('requires a minimum of 100 wei for contribution', async () => {
        try {
            await campaignContract.methods.contribute().send({ from: accounts[2], value: '5' });
            assert(false);
        } catch (err) {
            assert(err)
        }
    })

     it("processes requests", async () => {
    await campaignContract.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    await campaignContract.methods
      .createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
      .send({ from: accounts[0], gas: "5000000" });

    await campaignContract.methods.approveRequest(0).send({
      from: accounts[0],
      gas: "5000000",
    });

    await campaignContract.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "5000000",
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);
    console.log(balance);
    assert(balance > 104);
  });





})
import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    "0xA91C89f181B9E3c08EAD475557f08733E1e2dBE8"
);


export default instance;
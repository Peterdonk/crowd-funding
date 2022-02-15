import React, { useEffect, useState } from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';


function home ({campaignLists}){

    return <Layout>
         
        <h1>Open Campaigns</h1>
        <Link route='/campaigns/new'>
        <a>
                 <Button floated="right" content="Create Campaign" icon="add circle" primary />
        </a>
        </Link>
       
        <Card.Group centered items={campaignLists} />
       
    </Layout>;
}

home.getInitialProps = async (ctx) => {
    const campaignLists = await factory.methods.getAllDeployedCampaigns().call();

    const campaignListObject = campaignLists.map(address => {
        return { 
             header: address,
            description:(<Link route={`/campaigns/${address}`}><a>View Campaign</a></Link>),
            fluid: true,
       }
    })

    console.log(campaignListObject);


    return { campaignLists: campaignListObject }
}

export default home



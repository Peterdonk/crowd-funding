import { React, useEffect, useState } from "react";
import Layout from '../../components/Layout';
import { useRouter } from 'next/router'
import Campaign from '../../ethereum/campaign';
import {Card, Grid, Button} from 'semantic-ui-react'
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

function showCampaign() {

    const [campaignCardDetails, setCampaignCardDetails] = useState([]);
    const [campaignAddress, setCampaignAddress] = useState('');

    const router = useRouter()
    useEffect(() => { 
        async function getSummary() {

            try {
                
            const campaignAddress = router.asPath.split("/")[2];
            setCampaignAddress(campaignAddress);


            const campaign = await Campaign(campaignAddress);
            const summary = await campaign.methods.getSummary().call();

                
                 const items = [
                    {
                    
                        header: summary[4],
                        meta: 'Address Of Manager',
                         description: 'The manager created this campaign and can create requests to withdraw money',
                        style:{overflowWrap:'break-word'}
                    },
                    {
                    
                        header: summary[0],
                        meta: 'Minimum Contribution(Wei)',
                         description: 'You must contribute at least this much wei to become an approver',
                        style:{overflowWrap:'break-word'}
                    },
                    {
                    
                        header: summary[2],
                        meta: 'Number of Requests',
                         description: 'A request tries to withdraw money from the contract. Request must be approved by approvers',
                        style:{overflowWrap:'break-word'}
                    },
                    {
                    
                        header: summary[3],
                        meta: 'Number of Approvers',
                         description: 'Number of people who have already donated to this campaign',
                        style:{overflowWrap:'break-word'}
                    },
                    {
                    
                        header: web3.utils.fromWei(summary[1],'ether'),
                        meta: 'Campaign Balance (ether)',
                         description: 'Balance of how much campaign money has left to spend',
                        style:{overflowWrap:'break-word'}
                    }
                ];

                setCampaignCardDetails(items);

            } catch (error) {
                alert(error.message);
                console.log(error.message);
            }
        }

        getSummary();

    }, []);

    
    return (
        <Layout>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={10}>
                    <Card.Group items={campaignCardDetails}></Card.Group>
                    </Grid.Column>
                    
                    <Grid.Column width={6}>
                    <ContributeForm address={campaignAddress }/>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column>
                    <Link route={`/campaigns/${campaignAddress}/requests`}>
                        <a>
                        <Button primary>View Requests</Button>
                        </a>
                        </Link>
                        
                        <Link route='/'>
                            <a>
                            <Button negative>Cancel</Button>
                            </a>
                        </Link>
                </Grid.Column>
                </Grid.Row>
                
            </Grid>
           
        </Layout>
    )
}

export default showCampaign
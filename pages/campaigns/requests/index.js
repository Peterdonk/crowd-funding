import { React, useEffect, useState } from "react"
import Layout from '../../../components/Layout';
import { Link } from '../../../routes'
import { useRouter } from 'next/router'
import { Button,Table } from 'semantic-ui-react'
import Campaign from '../../../ethereum/campaign'
import RequestRow from '../../../components/RequestRow'


function RequestsPage(props) {

    const router = useRouter()
    const [getCampaignAddress, setCampaignAddress] = useState('');
    const [requestsList, setRequestList] = useState([]);
    let arrayList = [];

    useEffect(() => {
        
        let campaignAddress = router.asPath.split("/")[2];
        setCampaignAddress(campaignAddress);
        
        async function getRequests() {

            const campaign = await Campaign(campaignAddress);

            const requestCount = await campaign.methods.getRequestsCount().call();

            const requests = await Promise.all(Array(requestCount).fill().map((element, index) => {
                return campaign.methods.requests(index).call();
            }))

            console.log(requests[0].length());
            setRequestList(requests[0]);


            // const campaignResults = 

            arrayList.push(requests[0][1]);

            console.log('Pop',arrayList);

        }

        getRequests();

    },[])

    const { Header, Row, HeaderCell, Body, Cell } = Table;

    console.log('Request lists',requestsList)
    
    return (
        <Layout>
            <h3>Requests</h3>
            <Link route={`/campaigns/${getCampaignAddress}/requests/new` }>
                <a>
                    <Button primary>Add Request</Button>
                </a>
            </Link>
             <Link route={`/campaigns/${getCampaignAddress}`}>
                <a>
                   <Button negative>Cancel</Button>
                </a>
            </Link>
            <Table>
                <Header>
                    <Row>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>Approval Count</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Finalize</HeaderCell>
                    </Row>
                </Header>

                <Body>
                        <Row>
                            <Cell>
                            1
                        </Cell>
                        <Cell>
                            rere
                        </Cell>
                    </Row>
                  
                </Body>
            </Table>
        </Layout>
    )
}

export default RequestsPage;



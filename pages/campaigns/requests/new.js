import { React, useState, useEffect } from "react"
import { Form, Button, Message, Input } from 'semantic-ui-react'
import Campaign from '../../../ethereum/campaign'
import web3 from '../../../ethereum/web3'
import { Link, Router } from '../../../routes'
import Layout from '../../../components/Layout'
import { useRouter } from 'next/router'

function RequestNew() {

    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [recipient, setRecipient] = useState('');
    const router = useRouter()
    const [getCampaignAddress, setCampaignAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        
        const campaignAddress = router.asPath.split("/")[2];
        console.log(campaignAddress);
    setCampaignAddress(campaignAddress);

    }, [])
    
    async function handleSubmit() {

        try {
        
        setIsLoading(true);
        setErrorMessage('');
            
        const campaign = await Campaign(getCampaignAddress);

        const accounts = await web3.eth.getAccounts();

        await campaign.methods.createRequest(
        description,web3.utils.toWei(value,'ether'),recipient
        ).send({
        from: accounts[0]
        })
            
            setIsLoading(false);
            Router.pushRoute(`/campaigns/${getCampaignAddress}/requests`);


        } catch (error) {
            console.log(error.message)
            setIsLoading(false);
            setErrorMessage(error.message);
        }
       

    }



    return (
        <Layout>
           
            <h2>Create a Request</h2>
             <Form onSubmit={()=>handleSubmit()} error={Boolean(errorMessage)}>
            <Form.Field>
                <label>Description</label>
                <Input onChange={e => setDescription(e.target.value)} value={ description}/>
            </Form.Field>
            <Form.Field>
                <label>Value in Ether</label>
                 <Input  onChange={e => setValue(e.target.value)} value={ value}/>
            </Form.Field>
            <Form.Field>
                <label>Recipient</label>
                 <Input  onChange={e => setRecipient(e.target.value)} value={ recipient}/>
            </Form.Field>
                <Message error content={errorMessage}/>
                <Button primary loading={isLoading}>Create!</Button>
                 <Link route={`/campaigns/${getCampaignAddress}/requests`}>
                <a>
                   <Button negative>Cancel</Button>
                </a>
            </Link>
           

            </Form>
        </Layout>
       
    )
}


export default RequestNew
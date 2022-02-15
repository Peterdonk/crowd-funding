import { React, useState } from 'react'
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { useRouter } from 'next/router'



function ContributeForm(props) {

    const campaignAddress = props.address;
    const router = useRouter()

    const [amountToContribute, setAmountToContribute] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasErrors, setErrors] = useState('');

    async function handleSubmit() {

        try {

            const campaign = await Campaign(campaignAddress);

            setIsLoading(true);
            setErrors('');
            
            const accounts = await web3.eth.getAccounts();
            const results = await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(amountToContribute)
            })

            console.log(amountToContribute);
            setIsLoading(false);
            router.reload(window.location.pathname)

        } catch (error) {
            console.log(error.message);
            setErrors(error.message);
            setIsLoading(false);
        }
    }
    

    return (
        <Form onSubmit={()=>handleSubmit()} error={Boolean(hasErrors)}>
            <Form.Field>
                <label>Amount to contribute</label>
                <Input label="ether" labelPosition="right" onChange={e=>setAmountToContribute(e.target.value)} value={amountToContribute}/>
            </Form.Field>

            <Message error content={hasErrors}/>
            <Button primary type='submit' loading={isLoading}>Contribute!</Button>
        </Form>
    )
}


export default ContributeForm;



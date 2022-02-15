import {React, useState} from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import { Router, Link } from '../../routes';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3'

function home() {

    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [spinner, setSpinner] = useState(false);
    

    async function submitButtonClicked() {

        setSpinner(true);
        setErrorMessage('');

        try {
             const accounts = await web3.eth.getAccounts();

        await factory.methods.createCampaign(inputValue).send({
            from: accounts[0]     
        });
            
            setSpinner(false);
            Router.pushRoute('/');

        } catch (error) {

            console.log(error);
            setErrorMessage(error.message);
            setSpinner(false);
            
        }
       
    }

    return (
        <Layout>
            <h1 style={{marginTop:'2rem'}}>Create a Campaign</h1>
    <Form error={Boolean(errorMessage)}>
        <Form.Field >
        <label>Minimum Contribution</label>
                    <Input label="wei" labelPosition="right" placeholder='' onChange={e=>setInputValue(e.target.value)} value={ inputValue}/>
                </Form.Field>
            <Message error header="Oops!" content={errorMessage} />
                <Button type='submit' loading={spinner} primary onClick={() => submitButtonClicked()}>Create </Button>
                 <Link route='/'>
                            <a>
                            <Button negative>Cancel</Button>
                            </a>
                        </Link>
  </Form>

            </Layout>
    )
}



export default home;
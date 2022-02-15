import React from 'react'
import {Table} from 'semantic-ui-react'

function RequestRow({ key, item }) {
    
    console.log('I am initiated');
    
    const { Cell, Row } = Table;
    console.log(key);
    console.log(item)
    return(
    <Row>
        <Cell>12</Cell>
        <Cell>12</Cell>
        <Cell>12</Cell>
        <Cell>12</Cell>
        <Cell>12</Cell>
        <Cell>12</Cell>
        <Cell>12</Cell>
    </Row>
    )
}


export default RequestRow
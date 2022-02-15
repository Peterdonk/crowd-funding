// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.11;


contract CampaignFactory{
    address[] public  deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum,msg.sender));
        deployedCampaigns.push(newCampaign);
    } 

    function getAllDeployedCampaigns() public view returns(address[] memory){
        return deployedCampaigns;
    }
}


contract Campaign{

struct Request{
    string description;
    uint value;
    address receipient;
    bool completed;
    uint approvalCount;
    mapping(address=>bool) approvals;
}


address public managersAddress;
uint minimumContribution;
mapping(address=>bool) public approvers;
uint approversCount; 

// Update request array to mapping
mapping(uint=>Request) public requests;

// Add Number of Requests
uint numOfRequests;


modifier restricted(){
    require(msg.sender == managersAddress);
    _;
}

constructor(uint _minimumContribution, address sender){
    managersAddress = sender;
    // managersAddress = msg.sender;
    minimumContribution = _minimumContribution;
}

function contribute() public payable{
    require(msg.value > minimumContribution,"Please top up to become an approver");
    require(approvers[msg.sender] == false,"Already voted");
    approvers[msg.sender] = true;

    approversCount++;
}

function createRequest(string memory description, uint value, address receipient) public restricted payable{
    Request storage newRequest = requests[numOfRequests++]; // requests[1]
    newRequest.description = description;
    //requests[1].description = description;
    newRequest.value = value;
    newRequest.receipient = receipient;
    newRequest.completed = false;
    newRequest.approvalCount = 0;
    newRequest.approvals[msg.sender] = false;
}


function approveRequest(uint requestID) public {
    require(approvers[msg.sender],"Sorry, you are not an approver");
    require(requests[requestID].approvals[msg.sender] == false,"You have already approved this request");

    requests[requestID].approvals[msg.sender] = true;
    requests[requestID].approvalCount++;
}

function finalizeRequest(uint requestID) public payable{
     require(msg.sender == managersAddress);
     require(requests[requestID].completed == false,"This request has already been completed");
     require(requests[requestID].approvalCount > (approversCount / 2),"At least half of approvers should accept this request");
     requests[requestID].completed = true;
      payable(requests[requestID].receipient).transfer(requests[requestID].value);

}


function getSummary() public view returns(uint,uint,uint,uint,address){
    return(minimumContribution,address(this).balance,numOfRequests,approversCount,managersAddress);
}

function getRequestsCount() public view returns(uint){
    return numOfRequests;
}

}
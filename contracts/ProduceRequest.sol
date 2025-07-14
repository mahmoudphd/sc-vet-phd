// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Product.sol";

contract ProduceRequest {
    enum RequestStatus { Pending, Approved, Rejected }
    enum QCStatus { NotRequested, Requested, Approved, Rejected }
    enum EDAStatus { NotSubmitted, Submitted, Approved, Rejected }

    struct ProduceRequestDetails {
        uint256 id;
        RequestStatus status;
        uint256 quantity;
        uint256 productId; // Links to the Product contract
        QCStatus qcStatus;
        EDAStatus edaStatus;
    }

    // Mapping to store produce requests
    mapping(uint256 => ProduceRequestDetails) public produceRequests;
    uint256 public requestCount;

    // Events
    event RequestAdded(uint256 indexed id, uint256 productId, uint256 quantity);
    event RequestUpdated(uint256 indexed id, RequestStatus status, QCStatus qcStatus, EDAStatus edaStatus);
    event RequestRemoved(uint256 indexed id);

    // Add a new produce request
    function addRequest(uint256 _productId, uint256 _quantity) public {
        requestCount++;
        produceRequests[requestCount] = ProduceRequestDetails(requestCount, RequestStatus.Pending, _quantity, _productId, QCStatus.NotRequested, EDAStatus.NotSubmitted);
        emit RequestAdded(requestCount, _productId, _quantity);
    }

    // Update a produce request
    function updateRequest(
        uint256 _id,
        RequestStatus _status,
        QCStatus _qcStatus,
        EDAStatus _edaStatus
    ) public {
        require(produceRequests[_id].id != 0, "Request does not exist");
        produceRequests[_id].status = _status;
        produceRequests[_id].qcStatus = _qcStatus;
        produceRequests[_id].edaStatus = _edaStatus;
        emit RequestUpdated(_id, _status, _qcStatus, _edaStatus);
    }

    // Remove a produce request
    function removeRequest(uint256 _id) public {
        require(produceRequests[_id].id != 0, "Request does not exist");
        delete produceRequests[_id];
        emit RequestRemoved(_id);
    }

    // Get details of a produce request
    function getRequest(uint256 _id) public view returns (ProduceRequestDetails memory) {
        require(produceRequests[_id].id != 0, "Request does not exist");
        return produceRequests[_id];
    }
}
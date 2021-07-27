// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

contract hasapi {
    address internal api;

    modifier apionly() {
        require(msg.sender == api, "call only allowed from the api");
        _;
    }

    constructor(address _api) {
        api = _api;
    }
}

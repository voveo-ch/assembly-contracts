// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

contract hasapi {
    address internal api;

    modifier apionly() {
        require(msg.sender == api, "call only allowed from the api");
        _;
    }

    constructor(address _api) internal {
        api = _api;
    }
}

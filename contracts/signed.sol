// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

import "./libraries/LibSign.sol";

contract Signed {
    address public signatory;

    // signatory has signed message
    modifier isSigned(
        bytes memory secret,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) {
        // verified(secret, v, r, s);
        _;
    }

    constructor(address _signatory) internal {
        signatory = _signatory;
    }

    function verify(
        bytes memory secret,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal pure returns (address sender) {
        sender = LibSign.verify(secret, v, r, s);
    }

    // signatory has signed message
    function verified(
        bytes memory secret,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal view returns (address sender) {
        sender = LibSign.verify(secret, v, r, s);
        require(
            sender == signatory,
            "access denied, you are not the signatory of this contract"
        );
    }
}
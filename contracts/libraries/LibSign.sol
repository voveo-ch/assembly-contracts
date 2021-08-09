// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

library LibSign {
    function toEthSignedMessageHash(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }

    // verify sender of a signed message
    function verify(
        bytes memory secret,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public pure returns (address sender) {
        require(secret.length > 0, "not a valid secret");
        bytes32 signedHash = toEthSignedMessageHash(keccak256(secret));
        sender = ecrecover(signedHash, v, r, s);
        require(sender != address(0x0), "identification failed due to invalid signature");
    }
}

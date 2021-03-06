// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

import "./TokenErc20Ifc.sol";

interface VotingIfc {
    function tokenErc20() external view returns(TokenErc20);
}

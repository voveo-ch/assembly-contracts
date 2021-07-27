// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

import "./ITokenERC20.sol";

interface IVoting {
    function tokenErc20() external view returns(ITokenERC20);
}

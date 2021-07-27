// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "./ITokenERC20.sol";

interface IVoting {
    function tokenErc20() external view returns(ITokenERC20);
}

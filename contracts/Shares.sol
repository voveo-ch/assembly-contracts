// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

import "./TokenErc20Ifc.sol";
import "./owned.sol";

contract Shares is TokenErc20, owned {
    mapping(address => uint256) shareholders;
    uint256 total = 0;
    bool public locked = false; // lock before assembly starts

    modifier open {
        require(!locked, "configuration is already locked");
        _;
    }

    function setShareholder(address shareholder, uint256 shares)
        public
        open
        restrict
    {
        total = total + shares - shareholders[shareholder]; // remove previous add current
        shareholders[shareholder] = shares;
    }

    function setShareholders(
        address[] memory _shareholders,
        uint256[] memory _shares
    ) public open restrict {
        require(_shareholders.length == _shares.length, "array size missmatch");
        for (uint256 i = 0; i < _shares.length; ++i) {
            total = total + _shares[i] - shareholders[_shareholders[i]]; // remove previous add current
            shareholders[_shareholders[i]] = _shares[i];
        }
    }

    function lock() public open restrict {
        locked = true;
    }

    function name() override public view returns (string memory) {
        return "Shareholder Management";
    }

    function symbol() override public view returns (string memory) {
        return "$h";
    }

    function decimals() override public view returns (uint8) {
        return 0;
    }

    function totalSupply() override public view returns (uint256) {
        return total;
    }

    function balanceOf(address shareholder)
        public
        override
        view
        returns (uint256 balance)
    {
        return shareholders[shareholder];
    }

    function transfer(address, uint256) override public returns (bool success) {
        return false;
    }

    function transferFrom(
        address,
        address,
        uint256
    ) override public returns (bool success) {
        return false;
    }

    function approve(address, uint256) override public returns (bool success) {
        return false;
    }

    function allowance(address, address)
        public
        override
        view
        returns (uint256 remaining)
    {
        return 0;
    }

}
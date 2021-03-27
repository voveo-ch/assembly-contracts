// File: contracts/TokenErc20Ifc.sol

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

interface TokenErc20 {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint256);
    function balanceOf(address _owner) external view returns (uint256 balance);
    function transfer(address _to, uint256 _value) external returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);
    function approve(address _spender, uint256 _value) external returns (bool success);
    function allowance(address _owner, address _spender) external view returns (uint256 remaining);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

// File: contracts/owned.sol

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

contract owned {
    address payable internal owner;
    event feePaid(address to, uint amount);
    // creator is owner
    constructor() public {
        owner = msg.sender;
    }
    // only owner is allowed to call restricted function
    modifier restrict {
        require(msg.sender==owner, "access denied, you are not the contract owner");
        _;
    }
    // requires a fee for the owner
    modifier fee(uint amount) {
        require(msg.value>=amount, "not enough payment for the fee");
        _;
        owner.transfer(amount);
        emit feePaid(owner, amount);
    }

    function getOwner() view public returns (address payable) {
        return owner;
    }

    // allow update of the owner
    function changeOwner(address payable newOwner) public restrict {
        owner = newOwner;
    }

    // move whole balance to the owner
    function withdraw() public restrict {
        owner.transfer(address(this).balance);
    }

}

// File: contracts/Shares.sol

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;



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

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "./LibSign.sol";
import "../Shares.sol";
import "../Voting.sol";

library LibAssembly {
    struct Data {
        Shares shares; // shareholder token
        mapping(string => address) registrations; // users that registered, maps secret to address
        mapping(address => string) shareholders; // list of registered shareholders
        string[] secrets; // list of registered secrets
        address[] votings; // list of votings
        string identifier; // you may set any text here, e.w. the assembly purpose
    }

    function construct(
        Data storage data,
        string memory _identifier
    ) public {
        data.identifier = _identifier;
        data.shares = new Shares();
    }

    // shareholder's access, security by signed messages

    function register(
        Data storage data,
        string memory secret,
        address a,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        address shareholder = LibSign.verify(abi.encode(secret, a), v, r, s);
        require(
            data.registrations[secret] == address(0x0),
            "secret has already been used"
        );
        require(
            bytes(data.shareholders[shareholder]).length == 0,
            "you are already registered"
        );
        data.registrations[secret] = shareholder;
        data.shareholders[shareholder] = secret;
        data.secrets.push(secret);
    }

    // administration, restricted to assembly owner

    function setShareholder(
        Data storage data,
        address shareholder,
        uint256 shares
    ) public {
        data.shares.setShareholder(shareholder, shares);
    }

    function setShareholders(
        Data storage data,
        address[] memory shareholders,
        uint256[] memory shares
    ) public {
        data.shares.setShareholders(shareholders, shares);
    }

    function newVoting(
        Data storage data,
        string memory title,
        string memory proposal,
        address signatory,
        address payable owner
    ) public returns (address) {
        Voting voting = new Voting(title, proposal, data.shares, signatory);
        voting.changeOwner(owner);
        data.votings.push(address(voting));
        return address(voting);
    }

    function lock(Data storage data) public {
        data.shares.lock();
    }
}
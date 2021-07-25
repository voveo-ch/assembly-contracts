// File: contracts/owned.sol

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

contract owned {
    address payable internal owner;
    event feePaid(address to, uint256 amount);

    // creator is owner
    constructor() public {
        owner = msg.sender;
    }

    // only owner is allowed to call restricted function
    modifier restrict {
        require(msg.sender == owner, "access denied, you are not the contract owner");
        _;
    }
    // requires a fee for the owner
    modifier fee(uint256 amount) {
        require(msg.value >= amount, "not enough payment for the fee");
        _;
        owner.transfer(amount);
        emit feePaid(owner, amount);
    }

    function getOwner() public view returns (address payable) {
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

// File: contracts/libsign.sol

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

library libsign {
    // verify sender of a signed message
    function verify(
        bytes memory secret,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public pure returns (address sender) {
        require(secret.length > 0, "not a valid secret");
        sender = ecrecover(keccak256(secret), v, r, s);
        require(sender != address(0x0), "identification failed due to invalid signature");
    }
}

// File: contracts/signed.sol

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

contract signed {
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
        sender = libsign.verify(secret, v, r, s);
    }

    // signatory has signed message
    function verified(
        bytes memory secret,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal view returns (address sender) {
        sender = libsign.verify(secret, v, r, s);
        require(sender == signatory, "access denied, you are not the signatory of this contract");
    }
}

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

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool success);

    function approve(address _spender, uint256 _value) external returns (bool success);

    function allowance(address _owner, address _spender) external view returns (uint256 remaining);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

// File: contracts/VotingIfc.sol

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

interface VotingIfc {
    function tokenErc20() external view returns (TokenErc20);
}

// File: contracts/LibVoting.sol

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

library LibVoting {
    struct Data {
        string title;
        string proposal;
        uint256 starttime;
        uint256 endtime;
        uint256 aye;
        uint256 nay;
        uint256 abstain;
        uint256 standDown;
        TokenErc20 tokenErc20;
        mapping(address => bool) voters;
    }

    enum Vote {
        Yes, /*0*/
        No, /*1*/
        Abstain, /*2*/
        StandDown /*3*/
    }

    function construct(
        Data storage data,
        string memory title,
        string memory proposal,
        TokenErc20 token
    ) public {
        require(bytes(title).length > 0, "voting title is required");
        require(bytes(proposal).length > 0, "voting proposal is required");
        data.title = title;
        data.proposal = proposal;
        data.starttime = 0;
        data.endtime = 0;
        data.tokenErc20 = token;
    }

    function setVotingTime(
        Data storage data,
        uint256 starttime,
        uint256 endtime
    ) public {
        if (starttime == 0 && endtime > 0) {
            starttime = now;
            endtime += starttime;
        }
        require(endtime != 0, "endttime is not defined");
        require(starttime != 0, "startime is not defined");
        require(endtime > starttime, "endttime is not after starttime");
        require(starttime >= now, "start time must be in the future");
        require(data.starttime == 0 && data.endtime == 0, "time is already configured");
        data.starttime = starttime;
        data.endtime = endtime;
    }

    function castVote(
        Data storage data,
        Vote vote,
        address a,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public returns (uint256 shares) {
        address shareholder = libsign.verify(abi.encode(vote, a), v, r, s);
        require(!data.voters[shareholder], "already voted");
        shares = data.tokenErc20.balanceOf(shareholder);
        require(shares > 0, "not a validated shareholder");
        data.voters[shareholder] = true;
        if (vote == Vote.Yes) {
            data.aye += shares;
        } else if (vote == Vote.No) {
            data.nay += shares;
        } else if (vote == Vote.Abstain) {
            data.abstain += shares;
        } else if (vote == Vote.StandDown) {
            data.standDown += shares;
        }
    }

    /* function voteYes(
        Data storage data,
        address a,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        data.aye += castVote(data, a, v, r, s);
    }

    function voteNo(
        Data storage data,
        address a,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        data.nay += castVote(data, a, v, r, s);
    }

    function voteAbstain(
        Data storage data,
        address a,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        data.abstain += castVote(data, a, v, r, s);
    }

    function voteStandDown(
        Data storage data,
        address a,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        data.standDown += castVote(data, a, v, r, s);
    } */
}

// File: contracts/Voting.sol

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

contract Voting is VotingIfc, owned, signed {
    using LibVoting for LibVoting.Data;
    LibVoting.Data private data;

    modifier isclosed {
        require(closed(), "voting not yet closed");
        _;
    }

    modifier isRunning {
        require(!closed(), "voting is already closed");
        require(started(), "voting is not yet started");
        _;
    }

    constructor(
        string memory title,
        string memory proposal,
        TokenErc20 token,
        address _signatory
    ) public signed(_signatory) {
        data.construct(title, proposal, token);
    }

    function setVotingTime(
        uint256 starttime,
        uint256 endtime,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public restrict isSigned(abi.encode(starttime, endtime, address(this)), v, r, s) {
        data.setVotingTime(starttime, endtime);
    }

    function title() public view returns (string memory) {
        return data.title;
    }

    function proposal() public view returns (string memory) {
        return data.proposal;
    }

    function starttime() public view returns (uint256) {
        return data.starttime;
    }

    function endtime() public view returns (uint256) {
        return data.endtime;
    }

    function currenttime() public view returns (uint256) {
        return block.timestamp;
    }

    function aye() public view isclosed returns (uint256) {
        return data.aye;
    }

    function nay() public view isclosed returns (uint256) {
        return data.nay;
    }

    function abstain() public view isclosed returns (uint256) {
        return data.abstain;
    }

    function standDown() public view isclosed returns (uint256) {
        return data.standDown;
    }

    function tokenErc20() public view override returns (TokenErc20) {
        return data.tokenErc20;
    }

    function voters(address i) public view returns (bool) {
        return data.voters[i];
    }

    function resolution()
        public
        view
        isclosed
        returns (
            bool,
            uint256,
            string memory,
            string memory
        )
    {
        return (accepted(), data.endtime, data.title, data.proposal);
    }

    function closed() public view returns (bool) {
        return data.starttime > 0 && data.endtime > 0 && block.timestamp >= data.endtime;
    }

    function started() public view returns (bool) {
        return data.starttime > 0 && data.endtime > 0 && block.timestamp >= data.starttime;
    }

    function running() public view returns (bool) {
        return started() && !closed();
    }

    function accepted() public view isclosed returns (bool) {
        return data.aye > data.nay;
    }

    function rejected() public view isclosed returns (bool) {
        return data.aye <= data.nay;
    }

    function votes() public view isclosed returns (uint256, uint256) {
        return (data.aye, data.nay);
    }

    function canVote(address sender) public view returns (bool) {
        return !closed() && !data.voters[sender];
    }

    function castVote(
        LibVoting.Vote vote,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public restrict isRunning {
        data.castVote(vote, address(this), v, r, s);
    }

    /* function voteYes(
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public restrict isRunning {
        data.voteYes(address(this), v, r, s);
    }

    function voteNo(
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public restrict isRunning {
        data.voteNo(address(this), v, r, s);
    }

    function voteAbstain(
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public restrict isRunning {
        data.voteAbstain(address(this), v, r, s);
    }

    function voteStandDown(
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public restrict isRunning {
        data.voteStandDown(address(this), v, r, s);
    } */
}

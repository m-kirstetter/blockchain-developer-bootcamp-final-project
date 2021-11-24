// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./interfaces/ISmarterContract.sol";

/// @title SmarterContract - a Blockchain implementation for contracting and milestones payment
/// @author Manuel Kirstetter
/// @notice Use for testing purpose only, no guarantee
/// @custom:experimental This is an experimental contract.
contract SmarterContract is ISmarterContract, Initializable, Context, ReentrancyGuard {
    /// @notice contract locked state
    /// @return returns contract locked state
    bool public locked;

    /// @notice contract client address
    /// @return returns contract client address
    address public client;

    /// @notice contract provider address
    /// @return returns contract provider address
    address public provider;

    /// @notice total contract value
    /// @return returns total contract value
    uint256 public total = 0;

    /// @notice contract current milestone
    /// @return returns contract current milestone
    uint256 public currentMilestone = 0;

    /// @notice contract milestones
    /// @return returns contract milestone of id/index
    uint256[] public milestones;

    /// @notice event fired at contract creation
    /// @param client contract client
    /// @param provider contract provider
    /// @param milestones array of all contract milestones
    /// @dev client & provider are indexed in topics
    event Register(
        address indexed client,
        address indexed provider,
        uint256[] milestones
    );

    /// @notice event fired at fund deposit
    /// @param amount deposit amount
    event Received(uint256 amount);

    /// @notice event fired at milestone release/fund transfer
    /// @param milestone milestone id/index
    /// @param amount amount transferred
    event Release(uint256 milestone, uint256 amount);

    modifier isNotLocked () {
        require (!locked, "Contract is locked");
        _;
    }

    modifier isClient (address _address) {
        require (_address == client, "You are not contract Client");
        _;
    }

    modifier isReleasable () {
        require (address(this).balance > 0, "Can't release any milestone. Have you deposit funds?");
        _;
    }

    /// @notice initialize a new contract with provided params
    /// @param _client client address
    /// @param _provider provider address
    /// @param _milestones array of milestone amounts
    /// @dev this function has the role of constructor here - factory pattern
    /// @dev this function initializes contract - see CWE-665
    function init(
        address _client,
        address _provider,
        uint256[] calldata _milestones
    ) external override initializer {
        require(_client != address(0), "Client address is invalid");
        require(_provider != address(0), "Provider address is invalid");

        client = _client;
        provider = _provider;
        milestones = _milestones;
        for (uint256 i = 0; i < milestones.length; i++) {
            total = total + milestones[i];
        }

        emit Register(_client, _provider, milestones);
    }

    /// @notice to get number of milestones
    /// @return returns the milestones array length
    function milestonesListLength() external view returns (uint256) {
        return milestones.length;
    }

    /// @notice releases milestone and transfer milestone associated fund
    /// @param _milestone milestone id/index to release
    /// @dev reentrancy protection modifier - see SWC-107
    function release(uint256 _milestone) external nonReentrant isNotLocked isClient(_msgSender()) isReleasable {
        require(_milestone == currentMilestone, "Invalid milestone: this is not the current milestone to release");

        currentMilestone = _milestone + 1;

        emit Release(_milestone, milestones[_milestone]);

        _transfer(provider, milestones[_milestone]);
    }

    /// @notice transfer funds to address
    /// @param _to address to transfer funds
    /// @param _amount amount to be transferred
    /// @dev using up-to-date way to transfer funds, without gas limit and with access control - see SWC-134 & SWC-105
    function _transfer(address _to, uint _amount) private isNotLocked {
        require(_to == provider, "Transfer address is invalid");
        require(address(this).balance >= _amount, "Insufficient contract balance");

        (bool success, ) = payable(_to).call{value: _amount}("");
        require(success, "Failed to transfer");
    }

    /// @notice deposit funds to contract
    receive() external payable isNotLocked isClient(_msgSender()) {
        require(msg.value == total, 'Deposit should be total contract amount');
        emit Received(msg.value);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./interfaces/ISmarterContract.sol";

/// @title SmarterContract is an Ethereum implementation for freelance contracting and payment
/// @author Manuel Kirstetter
/// @notice Use this contract for testing purpose only, no guarantee
/// @custom:experimental This is an experimental contract.
contract SmarterContract is ISmarterContract, Initializable, Context, ReentrancyGuard {
    bool public locked;
    address public client;
    address public provider;
    uint256 public total = 0;
    uint256 public currentMilestone = 0;
    uint256[] public milestones;

    event Register(
        address indexed client,
        address indexed provider,
        uint256[] milestones
    );

    event Received(uint256 amount);
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

    function milestonesListLength() external view returns (uint256) {
        return milestones.length;
    }

    function release(uint256 _milestone) external nonReentrant isNotLocked isClient(_msgSender()) isReleasable {
        require(_milestone == currentMilestone, "Invalid milestone: this is not the current milestone to release");

        currentMilestone = _milestone + 1;

        emit Release(_milestone, milestones[_milestone]);

        _transfer(provider, milestones[_milestone]);
    }

    function _transfer(address _to, uint _amount) private {
        (bool success, ) = payable(_to).call{value: _amount}("");
        require(success, "Failed to transfer ");
    }

    receive() external payable isNotLocked isClient(_msgSender()) {
        require(msg.value >= total, 'Deposit too low, minimum deposit is total contract amount');
        emit Received(msg.value);
    }
}
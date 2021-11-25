// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9 <0.9.0;

/// @title ISmarterContract - interface of SmarterContract
/// @author Manuel Kirstetter
/// @notice Use for testing purpose only, no guarantee
/// @custom:experimental This is an experimental contract.
interface ISmarterContract {
    /// @notice initialize a new contract with provided params
    /// @param _externalId contract external id
    /// @param _client client address
    /// @param _provider provider address
    /// @param _milestones array of milestone amounts
    function init(
        string calldata _externalId,
        address _client,
        address _provider,
        uint256[] calldata _milestones
    ) external;

    /// @notice to get number of milestones
    /// @return returns the milestones array length
    function milestonesListLength() external view returns (uint256);

    /// @notice releases milestone and transfer milestone associated fund
    /// @param _milestone milestone id/index to release
    function release(uint256 _milestone) external;

    /// @notice deposit funds to contract
    receive() external payable; 
}
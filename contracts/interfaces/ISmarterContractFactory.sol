// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9 <0.9.0;

/// @title ISmarterContractFactory - interface of SmarterContractFactory
/// @author Manuel Kirstetter
/// @notice Use for testing purpose only, no guarantee
/// @custom:experimental This is an experimental contract.
interface ISmarterContractFactory {
    /// @notice creates a new contract with provided params
    /// @param _externalId contract external id
    /// @param _client client address
    /// @param _provider provider address
    /// @param _milestones array of milestone amounts
    /// @dev _milestones is available only during this function call
    /// @return Returns created contract address
    function create(
        string calldata _externalId,
        address _client,
        address _provider,
        uint256[] calldata _milestones
    ) external returns (address);

    /// @notice to get contract address of id/index
    /// @param _index contract id/index
    /// @return Returns contract address of id/index
    function getContractAddress(uint256 _index) external view returns (address);
}
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9 <0.9.0;

interface ISmarterContractFactory {
    function create(
        address _client,
        address _provider,
        uint256[] calldata _milestones
    ) external returns (address);
    
    function getContractAddress(uint256 _index) external view returns (address);
}
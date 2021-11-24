// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9 <0.9.0;

interface ISmarterContract {
    function init(
        address _client,
        address _provider,
        uint256[] calldata _milestones
    ) external;

    function release(uint256 _milestone) external;

    function milestonesListLength() external view returns (uint256);
}
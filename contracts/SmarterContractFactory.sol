// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9 <0.9.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./interfaces/ISmarterContractFactory.sol";
import "./interfaces/ISmarterContract.sol";

/// @title SmarterContractFactory - SmarterContract factory contract
/// @author Manuel Kirstetter
/// @notice Use for testing purpose only, no guarantee
/// @custom:experimental This is an experimental contract.
contract SmarterContractFactory is ISmarterContractFactory {
    /// @notice count of all 'child' contracts
    /// @return returns the count of 'child' contracts
    uint256 public contractCount = 0;

    /// @notice contract address from which all 'child' contract should be implemented from
    /// @dev immutable
    /// @return returns implementation contract address
    address public immutable implementation;

    mapping(uint256 => address) internal _contracts;

    /// @notice event fired at 'child' contract creation
    /// @param externalId contract external id
    /// @param index contract id/index
    /// @param contractAddress created contract address
    /// @param milestones array of all created contract milestones
    event LogNewContract(
        string externalId,
        uint256 indexed index,
        address contractAddress,
        uint256[] milestones
    );

    constructor(address _implementation) {
        require(_implementation != address(0), "Implementation contract address invalid");
        implementation = _implementation;
    }

    /// @notice calls initialization of a new contract with provided params
    /// @param _contractAddress contract address
    /// @param _externalId contract external id
    /// @param _client client address
    /// @param _provider provider address
    /// @param _milestones array of milestone amounts
    /// @dev _milestones is available only during this function call
    function _init(
        address payable _contractAddress,
        string calldata _externalId,
        address _client,
        address _provider,
        uint256[] calldata _milestones
    ) internal {
        ISmarterContract(_contractAddress).init(
            _externalId,
            _client,
            _provider,
            _milestones
        );

        uint256 contractId = contractCount;
        _contracts[contractId] = _contractAddress;
        contractCount = contractCount + 1;

        emit LogNewContract(_externalId, contractId, _contractAddress, _milestones);
    }

    /// @notice generates contract address calls initialization of a new contract with provided params
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
    ) external override returns (address) {
        address payable contractAddress = payable(address(Clones.clone(implementation)));

        _init(
            contractAddress,
            _externalId,
            _client,
            _provider,
            _milestones
        );

        return contractAddress;
    }

    /// @notice to get contract address of id/index 
    /// @param _index contract id/index
    /// @return Returns contract address of id/index
    function getContractAddress(uint256 _index) public view returns (address) {
        return _contracts[_index];
    }
}
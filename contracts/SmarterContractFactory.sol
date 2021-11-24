// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9 <0.9.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./interfaces/ISmarterContractFactory.sol";
import "./interfaces/ISmarterContract.sol";

contract SmarterContractFactory is ISmarterContractFactory {
    uint256 public contractCount = 0;
    mapping(uint256 => address) internal _contracts;

    event LogNewContract(
        uint256 indexed index,
        address contractAddress,
        uint256[] milestones
    );

    address public immutable implementation;

    constructor(address _implementation) {
        require(_implementation != address(0), "Implementation contract address invalid");
        implementation = _implementation;
    }

    function _init(
        address _contractAddress,
        address _client,
        address _provider,
        uint256[] calldata _milestones
    ) internal {
        ISmarterContract(_contractAddress).init(
            _client,
            _provider,
            _milestones
        );

        uint256 contractId = contractCount;
        _contracts[contractId] = _contractAddress;
        contractCount = contractCount + 1;

        emit LogNewContract(contractId, _contractAddress, _milestones);
    }

    function create(
        address _client,
        address _provider,
        uint256[] calldata _milestones
    ) external override returns (address) {
        address contractAddress = Clones.clone(implementation);

        _init(
            contractAddress,
            _client,
            _provider,
            _milestones
        );

        return contractAddress;
    }

    function getContractAddress(uint256 _index) public view returns (address) {
        return _contracts[_index];
    }
}
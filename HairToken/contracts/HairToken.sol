// contract/HairToken.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract HairToken is ERC20, ERC20Burnable {
    address payable public owner;

    constructor(uint256 initSupply) ERC20("HairToken", "HAIR") {
        owner = payable(msg.sender);
        _mint(owner, initSupply * (10**decimals()));
    }

    function destroy() public onlyOwner {
        selfdestruct(owner);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
}

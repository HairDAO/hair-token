// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HairToken is ERC20, ERC20Burnable, Ownable {
    // Mint initial supply and send it to the
    // initial supply recipient (probably the DAO multisig or the sales contract)
    constructor(uint256 initialSupply, address initialSupplyRecipient) ERC20("HairToken", "HAIR") {
        _mint(initialSupplyRecipient, initialSupply);
    }

    // Mint new tokens (can only be called by contract owner)
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
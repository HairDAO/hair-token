pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

// The address of the deployed HairToken contract
address hairTokenAddress = 0x3Ee14Fb2f993CdDCD655759f2df7f0d19328CC85;
//I Included the address of the second HairToken I deployed on Goerli. Sent a bit of initial supply to bakst as a test

// Reference to the deployed HairToken contract
contract HairToken is ERC20, ERC20Burnable {
    // The address of the contract
    address public contractAddress = hairTokenAddress;
    // The ABI of the contract
    bytes32[10] public contractABI;
}

// The auction contract that sells the HairToken ERC20 tokens
contract HairTokenAuction {
    // The fixed price of each HairToken in wei
    uint256 public fixedPrice;
    // The total number of HairTokens available for sale
    uint256 public totalAvailable;
    // The number of HairTokens that have been sold
    uint256 public totalSold;

    // Constructor function that sets the fixed price per token
    constructor(uint256 _fixedPrice) public {
        fixedPrice = _fixedPrice;
        // Initialize the total number of HairTokens available for sale to the total supply of the HairToken contract
        HairToken hairToken = HairToken(hairTokenAddress);
        totalAvailable = hairToken.totalSupply();
    }

    // Function that allows a user to buy a specified number of HairTokens at the fixed price
    function buyHairTokens(uint256 _numberOfTokens) public payable {
        // Check that the user has provided enough funds to cover the purchase
        require(msg.value >= fixedPrice * _numberOfTokens, "Not enough funds to complete the purchase");
        // Check that there are enough HairTokens available for sale
        require(_numberOfTokens <= totalAvailable - totalSold, "Not enough HairTokens available for sale");

        // Decrease the balance of the user and increase the total number of HairTokens sold
        HairToken hairToken = HairToken(hairTokenAddress);
        hairToken.safeTransferFrom(msg.sender, address(this), _numberOfTokens);
        totalSold += _numberOfTokens;

        // Send the fixed price per token to the msg.sender
        msg.sender.transfer(fixedPrice * _numberOfTokens);
    }
}

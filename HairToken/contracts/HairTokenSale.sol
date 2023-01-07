// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./HairToken.sol";

contract HairTokenSale is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold = 0;
    bool public saleActive = false;

    event TokenSale(address indexed buyer, uint256 amount);

    constructor(IERC20 _tokenContract, uint256 _tokenPrice) {
        tokenContract = IERC20(address(_tokenContract));
        tokenPrice = _tokenPrice;
    }

    function startSale() public onlyOwner {
        require(tokenContract.balanceOf(address(this)) >= 0, "No token balance to sell in this contract");
        saleActive = true;
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(saleActive, "Sale is not running");
        require(msg.value == (_numberOfTokens / (10 ** 18)) * tokenPrice, "Wrong amount of ETH sent");
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens, "Not enough tokens left for sale");

        // Transfer tokens to buyer
        tokenContract.safeTransfer(msg.sender, _numberOfTokens);

        tokensSold += _numberOfTokens;

        emit TokenSale(msg.sender, _numberOfTokens);
    }

    function endSale() public onlyOwner {
        address payable owner = payable(owner());

        // Transfer remaining tokens back to contract owner
        tokenContract.safeTransfer(msg.sender, tokenContract.balanceOf(address(this)));

        // Transfer ETH balance to contract owner at the end of the auction
        owner.transfer(address(this).balance);

        saleActive = false;
    }
}

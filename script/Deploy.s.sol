// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { HairToken } from "../contracts/HairToken.sol";

contract DeployScript is Script {
    address recipient = address(1)

    function run() public {
        vm.startBroadcast();

        Token token = new Token(0, recipient);
        console.log("Token deployed at: %s", address(token));

        vm.stopBroadcast();
    }
}

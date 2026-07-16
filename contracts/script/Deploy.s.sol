// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {SquaredLedger} from "../src/SquaredLedger.sol";

contract DeployScript is Script {
    function run() external returns (SquaredLedger) {
        vm.startBroadcast();
        SquaredLedger ledger = new SquaredLedger();
        vm.stopBroadcast();

        console.log("SquaredLedger deployed at:", address(ledger));
        return ledger;
    }
}

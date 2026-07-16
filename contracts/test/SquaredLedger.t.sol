// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {SquaredLedger} from "../src/SquaredLedger.sol";

contract SquaredLedgerTest is Test {
    SquaredLedger ledger;
    address debtor = address(0xD1);
    address creditor = address(0xC1);

    function setUp() public {
        ledger = new SquaredLedger();
        vm.deal(debtor, 10 ether);
    }

    function test_createDebt() public {
        vm.prank(debtor);
        uint256 id = ledger.createDebt(creditor, 1 ether, "lunch");

        SquaredLedger.Debt memory d = ledger.getDebt(id);
        assertEq(d.debtor, debtor);
        assertEq(d.creditor, creditor);
        assertEq(d.amount, 1 ether);
        assertEq(d.reason, "lunch");
        assertFalse(d.settled);
    }

    function test_createDebt_revertsOnZeroAddress() public {
        vm.prank(debtor);
        vm.expectRevert("invalid creditor");
        ledger.createDebt(address(0), 1 ether, "lunch");
    }

    function test_createDebt_revertsOnSelfDebt() public {
        vm.prank(debtor);
        vm.expectRevert("cannot owe yourself");
        ledger.createDebt(debtor, 1 ether, "lunch");
    }

    function test_createDebt_revertsOnZeroAmount() public {
        vm.prank(debtor);
        vm.expectRevert("amount must be > 0");
        ledger.createDebt(creditor, 0, "lunch");
    }

    function test_settleOnchain() public {
        vm.prank(debtor);
        uint256 id = ledger.createDebt(creditor, 1 ether, "transport");

        uint256 creditorBalanceBefore = creditor.balance;

        vm.prank(debtor);
        ledger.settleOnchain{value: 1 ether}(id);

        SquaredLedger.Debt memory d = ledger.getDebt(id);
        assertTrue(d.settled);
        assertTrue(d.settledOnchain);
        assertEq(creditor.balance, creditorBalanceBefore + 1 ether);
    }

    function test_settleOnchain_revertsForNonDebtor() public {
        vm.prank(debtor);
        uint256 id = ledger.createDebt(creditor, 1 ether, "data");

        vm.deal(creditor, 1 ether);
        vm.prank(creditor);
        vm.expectRevert("only debtor can settle");
        ledger.settleOnchain{value: 1 ether}(id);
    }

    function test_settleOnchain_revertsOnWrongAmount() public {
        vm.prank(debtor);
        uint256 id = ledger.createDebt(creditor, 1 ether, "data");

        vm.prank(debtor);
        vm.expectRevert("wrong amount sent");
        ledger.settleOnchain{value: 0.5 ether}(id);
    }

    function test_settleOnchain_revertsIfAlreadySettled() public {
        vm.prank(debtor);
        uint256 id = ledger.createDebt(creditor, 1 ether, "data");

        vm.prank(debtor);
        ledger.settleOnchain{value: 1 ether}(id);

        vm.deal(debtor, 1 ether);
        vm.prank(debtor);
        vm.expectRevert("already settled");
        ledger.settleOnchain{value: 1 ether}(id);
    }

    function test_confirmOfflineSettlement() public {
        vm.prank(debtor);
        uint256 id = ledger.createDebt(creditor, 1 ether, "cash");

        vm.prank(creditor);
        ledger.confirmOfflineSettlement(id);

        SquaredLedger.Debt memory d = ledger.getDebt(id);
        assertTrue(d.settled);
        assertFalse(d.settledOnchain);
    }

    function test_confirmOfflineSettlement_revertsForNonCreditor() public {
        vm.prank(debtor);
        uint256 id = ledger.createDebt(creditor, 1 ether, "cash");

        vm.prank(debtor);
        vm.expectRevert("only creditor can confirm");
        ledger.confirmOfflineSettlement(id);
    }

    function test_getUserDebts() public {
        vm.startPrank(debtor);
        uint256 id1 = ledger.createDebt(creditor, 1 ether, "one");
        uint256 id2 = ledger.createDebt(creditor, 2 ether, "two");
        vm.stopPrank();

        uint256[] memory debtorDebts = ledger.getUserDebts(debtor);
        uint256[] memory creditorDebts = ledger.getUserDebts(creditor);

        assertEq(debtorDebts.length, 2);
        assertEq(creditorDebts.length, 2);
        assertEq(debtorDebts[0], id1);
        assertEq(debtorDebts[1], id2);
    }
}

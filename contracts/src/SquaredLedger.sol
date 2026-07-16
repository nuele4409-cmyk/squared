// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SquaredLedger {
    struct Debt {
        uint256 id;
        address debtor;
        address creditor;
        uint256 amount;
        string reason;
        bool settled;
        bool settledOnchain;
        uint256 createdAt;
        uint256 settledAt;
    }

    uint256 public nextDebtId;
    mapping(uint256 => Debt) public debts;
    mapping(address => uint256[]) private debtsByUser;

    event DebtCreated(uint256 indexed id, address indexed debtor, address indexed creditor, uint256 amount, string reason);
    event DebtSettled(uint256 indexed id, bool onchain);

    function createDebt(address creditor, uint256 amount, string calldata reason) external returns (uint256) {
        require(creditor != address(0), "invalid creditor");
        require(creditor != msg.sender, "cannot owe yourself");
        require(amount > 0, "amount must be > 0");

        uint256 id = nextDebtId++;
        debts[id] = Debt(id, msg.sender, creditor, amount, reason, false, false, block.timestamp, 0);

        debtsByUser[msg.sender].push(id);
        debtsByUser[creditor].push(id);

        emit DebtCreated(id, msg.sender, creditor, amount, reason);
        return id;
    }

    function settleOnchain(uint256 id) external payable {
        Debt storage d = debts[id];
        require(d.debtor == msg.sender, "only debtor can settle");
        require(!d.settled, "already settled");
        require(msg.value == d.amount, "wrong amount sent");

        d.settled = true;
        d.settledOnchain = true;
        d.settledAt = block.timestamp;

        (bool success, ) = d.creditor.call{value: msg.value}("");
        require(success, "transfer failed");

        emit DebtSettled(id, true);
    }

    function confirmOfflineSettlement(uint256 id) external {
        Debt storage d = debts[id];
        require(d.creditor == msg.sender, "only creditor can confirm");
        require(!d.settled, "already settled");

        d.settled = true;
        d.settledAt = block.timestamp;

        emit DebtSettled(id, false);
    }

    function getUserDebts(address user) external view returns (uint256[] memory) {
        return debtsByUser[user];
    }

    function getDebt(uint256 id) external view returns (Debt memory) {
        return debts[id];
    }
}

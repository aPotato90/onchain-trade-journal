// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TradeJournal {
    struct Trade {
        string instrument;
        string setupTag;
        uint256 entryPrice;
        uint256 exitPrice;
        bool isLong;
        uint256 timestamp;
    }

    mapping(address => Trade[]) private trades;

    event TradeLogged(address indexed trader, uint256 indexed tradeIndex);

    function logTrade(
        string memory instrument,
        string memory setupTag,
        uint256 entryPrice,
        uint256 exitPrice,
        bool isLong
    ) public {
        trades[msg.sender].push(
            Trade(instrument, setupTag, entryPrice, exitPrice, isLong, block.timestamp)
        );
        emit TradeLogged(msg.sender, trades[msg.sender].length - 1);
    }

    function getTrades(address trader) public view returns (Trade[] memory) {
        return trades[trader];
    }

    function getTradeCount(address trader) public view returns (uint256) {
        return trades[trader].length;
    }
}
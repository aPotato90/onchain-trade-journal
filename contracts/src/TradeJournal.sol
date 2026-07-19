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
        bool voided;
    }

    mapping(address => Trade[]) private trades;

    event TradeLogged(address indexed trader, uint256 indexed tradeIndex);
    event TradeVoided(address indexed trader, uint256 indexed tradeIndex);

    function logTrade(
        string memory instrument,
        string memory setupTag,
        uint256 entryPrice,
        uint256 exitPrice,
        bool isLong
    ) public {
        trades[msg.sender].push(
            Trade(instrument, setupTag, entryPrice, exitPrice, isLong, block.timestamp, false)
        );
        emit TradeLogged(msg.sender, trades[msg.sender].length - 1);
    }

    function voidTrade(uint256 index) public {
        require(index < trades[msg.sender].length, "Invalid trade index");
        require(!trades[msg.sender][index].voided, "Already voided");
        trades[msg.sender][index].voided = true;
        emit TradeVoided(msg.sender, index);
    }

    function getTrades(address trader) public view returns (Trade[] memory) {
        return trades[trader];
    }

    function getTradeCount(address trader) public view returns (uint256) {
        return trades[trader].length;
    }
}
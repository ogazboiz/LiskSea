// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title PriceFeed
 * @dev A simple oracle contract that can store and retrieve price data
 *
 * For Challenge 4, we implement a basic price feed contract.
 * In production, you would use RedStone's evm-connector for real oracle data.
 *
 * Since we're on a testnet and experiencing package installation issues,
 * this contract provides a manual price feed mechanism where:
 * - An authorized updater can set prices
 * - Anyone can read the latest price
 * - Prices include timestamps for freshness checks
 */
contract PriceFeed {
    struct PriceData {
        uint256 price;      // Price with 8 decimals (e.g., 2000_00000000 = $2000.00)
        uint256 timestamp;  // When this price was updated
        string symbol;      // Asset symbol (e.g., "ETH/USD")
    }

    // Mapping from asset symbol to price data
    mapping(string => PriceData) public prices;

    // Address authorized to update prices
    address public updater;

    // Events
    event PriceUpdated(string symbol, uint256 price, uint256 timestamp);
    event UpdaterChanged(address indexed oldUpdater, address indexed newUpdater);

    constructor() {
        updater = msg.sender;
    }

    modifier onlyUpdater() {
        require(msg.sender == updater, "Only updater can call this function");
        _;
    }

    /**
     * @dev Update the price for an asset
     * @param symbol The asset symbol (e.g., "ETH/USD", "BTC/USD")
     * @param price The price with 8 decimals
     */
    function updatePrice(string memory symbol, uint256 price) external onlyUpdater {
        prices[symbol] = PriceData({
            price: price,
            timestamp: block.timestamp,
            symbol: symbol
        });

        emit PriceUpdated(symbol, price, block.timestamp);
    }

    /**
     * @dev Get the latest price for an asset
     * @param symbol The asset symbol
     * @return price The price with 8 decimals
     * @return timestamp When the price was last updated
     */
    function getPrice(string memory symbol) external view returns (uint256 price, uint256 timestamp) {
        PriceData memory data = prices[symbol];
        require(data.timestamp > 0, "Price not available for this symbol");
        return (data.price, data.timestamp);
    }

    /**
     * @dev Get the full price data for an asset
     * @param symbol The asset symbol
     * @return priceData The complete price data struct
     */
    function getPriceData(string memory symbol) external view returns (PriceData memory) {
        require(prices[symbol].timestamp > 0, "Price not available for this symbol");
        return prices[symbol];
    }

    /**
     * @dev Change the authorized price updater
     * @param newUpdater The new updater address
     */
    function setUpdater(address newUpdater) external onlyUpdater {
        require(newUpdater != address(0), "Invalid updater address");
        address oldUpdater = updater;
        updater = newUpdater;
        emit UpdaterChanged(oldUpdater, newUpdater);
    }

    /**
     * @dev Check if a price is fresh (updated within the last hour)
     * @param symbol The asset symbol
     * @return isFresh True if the price was updated within the last hour
     */
    function isPriceFresh(string memory symbol) external view returns (bool) {
        PriceData memory data = prices[symbol];
        if (data.timestamp == 0) return false;
        return (block.timestamp - data.timestamp) < 1 hours;
    }
}

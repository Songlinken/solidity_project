const { expect } = require("chai");
const exp = require("constants");
const { ethers } = require("hardhat"); 

describe("NFTMarket Test", function() {

    const nftAddress = process.env.TEST_CONTRACT_ADDRESS;

    it("Create and execute market sales", async function() {
        // Get contract that we want to deploy
        const marketFactory = await ethers.getContractFactory("NFTMarketPlace");

        // Deploy contract with the correct constructor args
        const marketContract = await marketFactory.deploy();

        // Wait for this transaction to be mined
        await marketContract.deployed();
        
        // Get contract address
        console.log("Contract deployed to: ", marketContract.address);

        let listingPrice = await marketContract.getListingPrice()
        listingPirce = listingPrice.toString()

        const auctionPrice = ethers.utils.parseUnits('0.01', 'ether')

        await marketContract.createMarketItem(nftAddress, 0, auctionPrice, {value: listingPrice})
        await marketContract.createMarketItem(nftAddress, 6, auctionPrice, {value: listingPrice})

        const [_, buyerAddress] = await ethers.getSigners()
        
        await marketContract.connect(buyerAddress).createMarketSale(nftAddress, 1, {value: auctionPrice})

        let items = await marketContract.fetchMarketItems()

        items = await Promise.all(items.map(async i => {
            const tokenURI = await nftAddress.tokenURI(i.tokenId)
            let item = {
                price: i.price.toString(),
                tokenId: i.tokenId.toString(),
                seller: i.seller,
                ower: i.ower,
                tokenURI
            }
            return item
        }))

        console.log('items: ', items)

    });
});
const { expect } = require("chai");
const exp = require("constants");
const { ethers } = require("hardhat"); 

describe("MSCollectible Test", function() {
    // global vars for LINK VRF
    const ipfs_base_uri = process.env.IPFS_BASE_URI;

    it("test_contract_address", async function() {
        // Get contract that we want to deploy
        const msFactory = await ethers.getContractFactory("MSCollectible");

        // Deploy contract with the correct constructor args
        const msContract = await msFactory.deploy(ipfs_base_uri);

        // Wait for this transaction to be mined
        await msContract.deployed();

        // Get contract address
        console.log("Contract deployed to: ", msContract.address);

        // Get max NFT supply
        expect(await msContract.MAX_SUPPLY()).to.equal(20);

        // Get Price
        expect(await msContract.PRICE()).to.equal(0.005 * 10 ** 18);

        // Get MAX_PER_MINT
        expect(await msContract.MAX_PER_MINT()).to.equal(4);
    });
});
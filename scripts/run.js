const { utils } = require("ethers");
const { ethers } = require("hardhat");

async function main() {
    const vrf_coordinator = process.env.Rinkeby_VRF_COORDINATOR;
    const link_token = process.env.Rinkeby_LINK_TOKEN;
    const key_hash = process.env.Rinkeby_KEY_HASH;
    const baseTokenURI = process.env.IPFS_BASE_URI;

    // Get owner/deployer's wallet address
    const [owner] = await hre.ethers.getSigners();

    // Get contract that we want to deploy
    const contractFactory = await hre.ethers.getContractFactory("MSCollectible");

    // Deploy contract with the correct constructor arguments
    const contract = await contractFactory.deploy(baseTokenURI);

    // Wait for this transaction to be mined
    await contract.deployed();

    // Get contract address
    console.log("Contract deployed to:", contract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
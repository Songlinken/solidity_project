require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

const { Rinkby_API_URL, MUMBAI_API_URL, MATIC_API_URL, PRIVATE_KEY, ETHERSCAN_API, POLYGONSCAN_API } = process.env;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "rinkeby",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    rinkeby: {
      url: Rinkby_API_URL,
      accounts: [PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 8000000000
    },
    mumbai: {
      url: MUMBAI_API_URL,
      accounts: [PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 35000000000
    },
    matic: {
      url: MATIC_API_URL,
      accounts: [PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 35000000000
    }
  },
  etherscan: {
    //apiKey: ETHERSCAN_API
    apiKey: POLYGONSCAN_API
  }
};
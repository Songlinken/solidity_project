import React, { Component } from "react";
import { ethers } from "ethers";
import contract from "../../contracts/MSCollectible.json";
import "./NFTMint.css";


const { TEST_CONTRACT_ADDRESS } = process.env;
const abi = contract.abi;


export default class NFTMint extends Component{

    state = {currentAddress: null};

    setCurrentAccount = (account) => {
        this.setState({currentAddress: account});
    }

    checkWalletIsConnected = async () => {
        const {ethereum} = window;

        if (!ethereum) {
            console.log("Make sure you have Metamask installed");
            return;
        } else {
            console.log("Wallet Exist");
        }

        const accounts = await ethereum.request({method: 'eth_accounts'});

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Authorized account: ", account);
            this.setCurrentAccount(account);
        } else {
            console.log("No account found")
        }
    }

    connectWalletHandler = async () => {
        const {ethereum} = window;

        if (!ethereum) {
            alert("Please Install Metamask");
        }

        try {
            const accounts = await ethereum.request({method: 'eth_requestAccounts'});
            console.log("Account Address: ", accounts[0]);
            this.setCurrentAccount(accounts[0]);
        } catch (err) {
            console.log(err)
        }
    }

    mintNFTHandler = async () => {
        try {
            const {ethereum} = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const singer = provider.getSigner();
                const nftContract = new ethers.Contract(TEST_CONTRACT_ADDRESS, abi, singer);

                console.log("Initialize Payment");
                let nftTxn = await nftContract.mintNFTs(1, {value: ethers.utils.parseEther("0.1")})

                console.log("Mining...")
                await nftTxn.wait();

                console.log(`Mined, see transaction on mumbai: ${nftTxn.hash}`);
            } else {
                console.log("Ethereum object does not exist")
            }
        } catch (err) {
            console.log(err);
        }
    }
    
    connectWalletButton = () => {
        return (
            <button onClick={this.connectWalletHandler} className="cta-button connect-wallet-button">
                Connect Wallet
            </button>
        )
    }

    mintNFTButton = () => {
        return (
            <button onClick={this.mintNFTHandler} className="cta-button mint-nft-button">
                Mint NFT (MS-Squad)
            </button>
        )
    }

    componentDidMount() {
        this.checkWalletIsConnected()
    }

    render() {
        return (
            <div className="main-app">
                <h1>MS-Squad Mint Page</h1>
                <div>
                    {this.state.currentAddress ? this.mintNFTButton(): this.connectWalletButton()}
                </div>
            </div>
        )
    }
}
import React, { Component, useEffect, useState } from "react";
import { constants, ethers } from "ethers";
import "./Cointracker.css";
import axios from 'axios'

export default class Cointracker extends Component {

    constructor(props) {
        super(props);
        this.state = {ethAddress: null, ethBalance: null, btcAddress:null, btcBalance: null};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    setCurrentAccount = (account) => {
        this.setState({ethAddress: account});
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

    getETHBalanceHandler = async () => {
        const {ethereum} = window;

        if (!ethereum) {
            alert("Please Install Metamask");
        }

        try {
            const balance = await ethereum.request({ 
                    method: "eth_getBalance", 
                    params: [this.state.ethAddress, "latest"] 
                });
                // Setting balance
            this.setState({ethBalance: ethers.utils.formatEther(balance)});
            console.log(this.state.balance);
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

    getETHBalanceButton = () => {
        return (
            <button onClick={this.getETHBalanceHandler} className="cta-button get-balance-button">
                Get ETH Balance
            </button>
        )
    }

    handleChange(event) {
        this.setState({btcAddress: event.target.value});
    }

    getBTCBalance = () => {
        
        fetch("/get/balance/" + this.state.btcAddress).then(
            response => response.json()
        )

        return (
            <div>
            <label>Get BTC Balance (enter your address): </label>
            <input type="text" value={this.state.btcAddress} className="cta-button get-balance-input">
            </input>
            <input type="submit" value="Submit"></input>
            </div>
        )
    }

    getBTCTransactions = () => {
        fetch("/get/trans/" + this.state.btcAddress).then(
            response => response.json()
        )

        return (
            <div>
            <label>Get BTC Transactions (enter your address): </label>
            <input type="text" value={this.state.btcAddress} className="cta-button get-balance-input">
            </input>
            <input type="submit" value="Submit"></input>
            </div>
        )
    }

    componentDidMount() {
        this.checkWalletIsConnected()
    }

    render() {
        return (
            <div className="main-app">
                <h1>Cointracker Homepage</h1>
                <div>
                    {this.state.ethAddress ? this.getETHBalanceButton(): this.connectWalletButton()}
                </div>
                <br/>
                <div>
                    {this.getBTCBalance()}
                </div>
                <br/>
                <div>
                    {this.getBTCTransactions()}
                </div>
            </div>
        )
    }
}
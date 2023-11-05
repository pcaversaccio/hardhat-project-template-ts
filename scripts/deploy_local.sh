#!/usr/bin/env bash

# Read the RPC URL
echo Enter your mainnet RPC URL to fork a local Hardhat node from \(script uses silent mode\;\ i.e. not printed to the console\):
echo Example: "https://eth-mainnet.alchemyapi.io/v2/XXXXXXXXXX"
read -s rpc

## Fork the mainnet
echo Please wait 1 minute for Hardhat to fork the mainnet and run locally...
echo If this command fails, try running "yarn" to install Hardhat dependencies...
make -s mainnet-fork ETH_MAINNET_RPC_URL=$rpc &

# Wait for Hardhat to fork the mainnet
sleep 60

# Read the contract name
echo Which contract do you want to deploy \(e.g. Greeter\)?
read contract

# Read the constructor arguments
echo Enter the constructor arguments separated by spaces \(e.g. hello 0xacc4de8d4ca96c3f0c91b58f1d6c0d80cf8cc146 1\):
read -ra args

if [ -z "$args" ]
then
  forge create -i ./contracts/src/${contract}.sol:${contract} --rpc-url "http://localhost:8545"
else
  forge create -i ./contracts/src/${contract}.sol:${contract} --rpc-url "http://localhost:8545" --constructor-args ${args}
fi

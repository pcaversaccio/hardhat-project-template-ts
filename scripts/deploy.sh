#!/usr/bin/env bash

# Read the RPC URL
echo Enter your RPC URL \(script uses silent mode\;\ i.e. not printed to the console\):
echo Example: "https://eth-mainnet.alchemyapi.io/v2/XXXXXXXXXX"
read -s rpc

# Read the private key
echo Enter your private key \(script uses silent mode\;\ i.e. not printed to the console\):
echo Example: "0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1"
read -s key

# Read the contract name
echo Which contract do you want to deploy \(e.g. Greeter\)?
read contract

# Read the constructor arguments
echo Enter the constructor arguments separated by spaces \(e.g. hello 0xacc4de8d4ca96c3f0c91b58f1d6c0d80cf8cc146 1\):
read -ra args

if [ -z "$args" ]
then
  forge create -i ./contracts/src/${contract}.sol:${contract} --rpc-url $rpc --private-key $key
else
  forge create -i ./contracts/src/${contract}.sol:${contract} --rpc-url $rpc --private-key $key --constructor-args ${args}
fi

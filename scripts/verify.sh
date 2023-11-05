#!/usr/bin/env bash

echo Which compiler version did you use to build?
read version
echo Selected compiler version: $version

echo Which contract do you want to verify \(e.g. Greeter\)?
read contract
echo Selected contract name: $contract

echo What is the deployed address?
read deployed
echo Selected contract address: $deployed

echo What is the chain ID of the deployed address?
read id
echo Selected chain ID: $id

echo Enter the constructor abi \(e.g. constructor\(string\)\):
read abi
echo Selected constructor abi: $abi

echo Enter the constructor arguments separated by spaces \(e.g. 1 2 3\):
read -ra args
echo Selected constructor arguments: $args

encoded=`cast abi-encode $abi $args`
echo ABI-encoded constructor arguments: ${encoded:2}

echo Enter your Etherscan API key:
read -s etherscan

if [ -z "$args" ]
then
  forge verify-contract --chain-id $id --compiler-version $version $deployed ./contracts/src/${contract}.sol:${contract} $etherscan
else
  forge verify-contract --constructor-args ${encoded:2} --chain-id $id --compiler-version $version $deployed ./contracts/src/${contract}.sol:${contract} $etherscan
fi

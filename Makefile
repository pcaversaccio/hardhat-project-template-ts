# dependencies
update          :; forge update

# install latest stable solc version
solc            :; sudo add-apt-repository ppa:ethereum/ethereum && sudo apt-get update && sudo apt-get install solc

# build & test
build           :; forge build
build-optimised :; forge build --optimize
test-forge      :; forge test
test-gasreport 	:; forge test --gas-report
trace           :; forge test -vvvvv
clean           :; forge clean
snapshot        :; forge snapshot

# chmod scripts
scripts         :; chmod +x ./scripts/*

# fork mainnet with Hardhat
mainnet-fork    :; npx hardhat node --fork ${ETH_MAINNET_RPC_URL}

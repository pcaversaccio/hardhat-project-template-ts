# include `.env` file and export its env vars
# (-include to ignore error if it does not exist)
-include .env

# dependencies
update:; forge update

# install proper solc version
solc:; nix-env -f https://github.com/dapphub/dapptools/archive/master.tar.gz -iA solc-static-versions.solc_0_8_13

# build & test
build  :; forge build
test   :; forge test
trace   :; forge test -vvv
clean  :; forge clean
snapshot :; forge snapshot

# chmod scripts
scripts :; chmod +x ./scripts/*

# fork mainnet with Hardhat
mainnet-fork :; npx hardhat node --fork ${ETH_MAINNET_RPC_URL}

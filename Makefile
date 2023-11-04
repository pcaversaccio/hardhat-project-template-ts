# dependencies
update          :; forge update

# install proper solc version
solc            :; nix-env -f https://github.com/dapphub/dapptools/archive/master.tar.gz -iA solc-static-versions.solc_0_8_22

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

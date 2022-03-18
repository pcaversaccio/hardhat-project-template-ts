# include `.env` file and export its env vars
# (-include to ignore error if it does not exist)
-include .env

# dependencies
update:; forge update

# build & test
build  :; forge build
test   :; forge test
trace   :; forge test -vvv
clean  :; forge clean
snapshot :; forge snapshot

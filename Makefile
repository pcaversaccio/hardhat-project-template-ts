# dependencies
update          :; forge update

# install latest stable solc version
solc:
	@command -v solc >/dev/null 2>&1 && { \
		echo "solc already installed: $$(solc --version | head -n1)"; \
		exit 0; \
	} || true
	@echo "Installing latest stable Solidity binary..."
	@TMPFILE=$$(mktemp) && \
	if wget -q https://github.com/ethereum/solidity/releases/latest/download/solc-static-linux -O $$TMPFILE 2>/dev/null; then \
		chmod +x $$TMPFILE && \
		sudo mv $$TMPFILE /usr/local/bin/solc && \
		echo "Installed: $$(solc --version | head -n1)"; \
	else \
		rm -f $$TMPFILE; \
		echo "Download failed. Install manually from https://github.com/ethereum/solidity/releases/latest."; \
		exit 1; \
	fi

# build & test
build           :; forge build
build-optimised :; forge build --optimize
test-forge      :; forge test
test-gasreport  :; forge test --gas-report
trace           :; forge test -vvvvv
clean           :; forge clean
snapshot        :; forge snapshot

# chmod scripts
scripts         :; chmod +x ./scripts/*

# fork mainnet with Hardhat
mainnet-fork    :; npx hardhat node --fork ${ETH_MAINNET_RPC_URL}

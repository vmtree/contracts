async function impersonateAccount(account) {
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [account]
    });
}

async function stopImpersonatingAccount(account) {
    await hre.network.provider.request({
        method: "hardhat_stopImpersonatingAccount",
        params: [account]
    });
}

async function enableForking(rpcUrl, blocknumber) {
    await hre.network.provider.request({
        method: "hardhat_reset",
        params: [{
            forking: {
                jsonRpcUrl: rpcUrl,
                blockNumber: blocknumber
            }
        }]
    });
}

async function disableForking() {
    await hre.network.provider.request({
        method: "hardhat_reset"
    });
}

async function increaseTime(time) {
    await hre.network.provider.request({
        method: "evm_increaseTime",
        params: [time]
    });
}

async function setNextBlockTimestamp(time) {
    await hre.network.provider.request({
        method: "evm_setNextBlockTimestamp",
        params: [time]
    });
}

async function mineBlock() {
    await hre.network.provider.request({
        method: "evm_mine",
    });
}

async function snapshot() {
    const snapshotId = await hre.network.provider.request({
        method: "evm_snapshot",
    });
    return snapshotId;
}

async function revertSnapshot(snapshotId) {
    await hre.network.provider.request({
        method: "evm_revert",
        params: [snapshotId]
    });
}

async function deploy(contractName, constructorArgs=[], libraries=null, verbose=false) {
    let contract;
    let factory;
    if (libraries) {
        factory = await hre.ethers.getContractFactory(contractName, {libraries});
    } else {
        factory = await hre.ethers.getContractFactory(contractName);
    }
    if (constructorArgs.length > 0) {
        contract = await factory.deploy(...constructorArgs);
    } else {
        contract = await factory.deploy();
    }
    await contract.deployed();
    if (verbose)
        console.log(`Deployed ${contractName} at ${contract.address}`);
    return contract;
}

async function deployBytes(contractName, abi, bytecode, verbose=false) {
    const [signer] = await hre.ethers.getSigners();
    const interface = new hre.ethers.utils.Interface(abi);
    const factory = new hre.ethers.ContractFactory(interface, bytecode, signer);

    const contract = await factory.deploy();
    await contract.deployed();
    if (verbose)
        console.log(`Deployed ${contractName} at ${contract.address}`);
    return contract;
}

module.exports = {
    impersonateAccount,
    stopImpersonatingAccount,
    enableForking,
    disableForking,
    increaseTime,
    setNextBlockTimestamp,
    mineBlock,
    snapshot,
    revertSnapshot,
    deploy,
    deployBytes,
}

import { 
    init,
    assert, 
    simulateTransactionBundle 
}                                       from './utils/utils';
import { 
    approveUSDCX, 
    upgradeUSDC, 
    setFlowrate, 
    setAutowrapAllowance,
}                                       from './calldata/test-usdc-stream';

import { 
    SENDER_ADDR, 
    USDC_ADDR, 
    USDCX_ADDR, 
    SUPERFLUID_ADDR, 
}                                       from './utils/addresses';

const { foundry, impersonatedSigner } = await init();

assert(impersonatedSigner.address == SENDER_ADDR, "Impersonated signer is not the ENS DAO Wallet/Timelock");

//////////////////////////////
// USDC Stream Transactions //
//////////////////////////////
const approveUSDCXCalldata = await approveUSDCX();
const upgradeUSDCCalldata = await upgradeUSDC();
const setFlowrateCalldata = await setFlowrate();
const setAutowrapAllowanceCalldata = await setAutowrapAllowance();

console.log("------------------------------------------");
console.log("-------- CALL DATA FOR USDC STREAM --------")
console.log("------------------------------------------");

console.log("------------------------------------------");
console.log(approveUSDCXCalldata);
console.log("------------------------------------------");
console.log(upgradeUSDCCalldata);
console.log("------------------------------------------");
console.log(setFlowrateCalldata);
console.log("------------------------------------------");
console.log(setAutowrapAllowanceCalldata);
console.log("------------------------------------------");

//////////////////////////////
///// TENDERLY SIMULATION ////
//////////////////////////////

// Array of all our transactions to simulate with Tenderly
const transactions = [
    // USDC Stream Transactions
    {
        from: SENDER_ADDR, 
        to: USDC_ADDR,
        input: approveUSDCXCalldata,
    },
   {
        from: SENDER_ADDR, 
        to: USDCX_ADDR,
        input: upgradeUSDCCalldata,
    },
    {
        from: SENDER_ADDR, 
        to: SUPERFLUID_ADDR,
        input: setFlowrateCalldata,
    },
    {
        from: SENDER_ADDR, 
        to: USDC_ADDR,
        input: setAutowrapAllowanceCalldata,
    },
]

const defaults = {
    network_id: '1',
    save: true,
    save_if_fails: true,
    simulation_type: 'full',
};

const builtTransactions = transactions.map(item => ({ ...defaults, ...item }));

if (!process.env.TENDERLY_API_KEY || !process.env.TENDERLY_USERNAME || !process.env.TENDERLY_PROJECT) {
    console.error("Please set TENDERLY_API_KEY/TENDERLY_USERNAME/TENDERLY_PROJECT in .env");
} else {
    await simulateTransactionBundle(builtTransactions);
}

await foundry.shutdown();
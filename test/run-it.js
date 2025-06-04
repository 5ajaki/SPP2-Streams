import { 
    init,
    assert, 
    simulateTransactionBundle 
}                                       from './utils/utils';
import { 
    stateAndRequirements,
    approveUSDCX, 
    upgradeUSDC, 
    setFlowrate, 
    setAutowrapAllowance,
}                                       from './calldata/test-usdc-stream';
import readline                         from 'readline';

import { 
    SENDER_ADDR, 
    USDC_ADDR, 
    USDCX_ADDR, 
    SUPERFLUID_ADDR, 
}                                       from './utils/addresses';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => {
    rl.question(query, (answer) => {
        resolve(answer);
    });
});

const { foundry, impersonatedSigner } = await init();

assert(impersonatedSigner.address == SENDER_ADDR, "Impersonated signer is not the ENS DAO Wallet/Timelock");

console.log("\n=== USDC Stream Transaction Generator ===\n");
console.log("This script will help you generate calldata for the following transactions:");
console.log("1. Approve USDCx contract to spend USDC from the ENS DAO Wallet/Timelock to fund the first month of streams.");
console.log("2. Upgrade (wrap) USDC to USDCx to fund the first month of streams.");
console.log("3. Set flow rate for the master stream to the Stream Management Pod.");
console.log("4. Set autowrap allowance to allow the Superfluid Autowrapper contracts to wrap more USDC to USDCx as required to service that flow.\n");


try {

    console.log("\nDiscerning Stream State and Requirements...");
    await stateAndRequirements();

    const proceed = await question("\nWould you like to proceed? (y/n): ");

    if (proceed.toLowerCase() !== 'y') {
        throw new Error("Exiting...");
    }

    // Define steps with their functions and descriptions
    const steps = [
        {
            name: "approveUSDCX",
            fn: approveUSDCX,
            description: "Generate approveUSDCX calldata"
        },
        {
            name: "upgradeUSDC",
            fn: upgradeUSDC,
            description: "Generate upgradeUSDC calldata"
        },
        {
            name: "setFlowrate",
            fn: setFlowrate,
            description: "Generate setFlowrate calldata"
        },
        {
            name: "setAutowrapAllowance",
            fn: setAutowrapAllowance,
            description: "Generate setAutowrapAllowance calldata"
        }
    ];


    // Store results
    const results = {};

    // Execute each step
    for (const step of steps) {
        console.log(`\n=== Step ${steps.indexOf(step) + 1}: ${step.description} ===`);
        const shouldProceed = await question(`Generate ${step.name} calldata? (y/n): `);
        
        if (shouldProceed.toLowerCase() !== 'y') {
            throw new Error("Step skipped. Exiting...");
        }

        results[step.name] = await step.fn();
        console.log("\nGenerated calldata:");
        console.log(results[step.name]);
    }

    // Prepare transactions for simulation
    const transactions = [
        {
            from: SENDER_ADDR, 
            to: USDC_ADDR,
            input: results.approveUSDCX,
        },
        {
            from: SENDER_ADDR, 
            to: USDCX_ADDR,
            input: results.upgradeUSDC,
        },
        {
            from: SENDER_ADDR, 
            to: SUPERFLUID_ADDR,
            input: results.setFlowrate,
        },
        {
            from: SENDER_ADDR, 
            to: USDC_ADDR,
            input: results.setAutowrapAllowance,
        },
    ];

    const defaults = {
        network_id: '1',
        save: true,
        save_if_fails: true,
        simulation_type: 'full',
    };

    const builtTransactions = transactions.map(item => ({ ...defaults, ...item }));

    // Check Tenderly configuration and ask about simulation
    if (!process.env.TENDERLY_API_KEY || !process.env.TENDERLY_USERNAME || !process.env.TENDERLY_PROJECT) {
        console.log("\nTenderly configuration not found in .env file.");
        console.log("Please set TENDERLY_API_KEY/TENDERLY_USERNAME/TENDERLY_PROJECT to enable simulations.");
    } else {
        const simulate = await question("\nWould you like to run Tenderly simulations? (y/n): ");
        if (simulate.toLowerCase() === 'y') {
            console.log("\nRunning Tenderly simulations...");
            await simulateTransactionBundle(builtTransactions);
        }
    }
} catch (error) {
    console.error("\nAn error occurred:", error);
} finally {
    rl.close();
    await foundry.shutdown();
}
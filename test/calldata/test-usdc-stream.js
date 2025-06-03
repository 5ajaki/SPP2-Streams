// This script generates the calldata for streaming funds from the ENS DAO wallet to the Stream Management Pod. 

// The Metagov stewards can then initiate the individual streams to the winners of EP 6.10 (https://snapshot.box/#/s:ens.eth/proposal/0x98c65ac02f738ddb430fcd723ea5852a45168550b3daf20f75d5d508ecf28aa1)

// If appropriate environment variables are set, the script will simulate the execution of the generated calldatas using Tenderly.


import { Contract }                     from 'ethers';
import { 
    ERC20_ABI, 
    USDCX_ABI, 
    SUPERFLUID_ABI, 
    AUTOWRAP_MANAGER_ABI 
}                                       from '../utils/abis';
import { 
    USDC_ADDR, 
    USDCX_ADDR, 
    SUPERFLUID_ADDR, 
    SENDER_ADDR, 
    AUTOWRAP_MANAGER_ADDR, 
    AUTOWRAP_STRATEGY_ADDR, 
    STREAM_MANAGEMENT_POD 
}                                       from '../utils/addresses';
import { init, assert }                 from '../utils/utils';

const { foundry, impersonatedSigner } = await init();

// Contract instances
const USDCContract              =  new Contract(USDC_ADDR, ERC20_ABI, foundry.provider);
const USDCXContract             =  new Contract(USDCX_ADDR, USDCX_ABI, foundry.provider);
const SuperfluidContract        =  new Contract(SUPERFLUID_ADDR, SUPERFLUID_ABI, foundry.provider);
const AutowrapManagerContract   =  new Contract(AUTOWRAP_MANAGER_ADDR, AUTOWRAP_MANAGER_ABI, foundry.provider);

const underlyingToken = await USDCXContract.getUnderlyingToken();
assert(underlyingToken === USDC_ADDR, "Underlying token is not USDC");

const USDCDecimals = await USDCContract.decimals();
assert(USDCDecimals === 6n, "USDC Decimals are not 6");

const USDCXDecimals = await USDCXContract.decimals();
assert(USDCXDecimals === 18n, "USDCX Decimals are not 18");

const USDCDivisor = BigInt(10) ** USDCDecimals;
assert(USDCDivisor === 1000000n, "USDC Divisor is not 1000000");

const USDCXDivisor = BigInt(10) ** USDCXDecimals;
assert(USDCXDivisor === 1000000000000000000n, "USDCX Divisor is not 1000000000000000000");

// For debugging/interest
const USDCBalanceBefore = await USDCContract.balanceOf(SENDER_ADDR);
//console.log("USDCBalanceBefore", USDCBalanceBefore);
//console.log("USDCBalanceBefore Formatted", USDCBalanceBefore / USDCDivisor);
const USDCXBalanceBefore = await USDCXContract.balanceOf(SENDER_ADDR);
//console.log("USDCXBalanceBefore", USDCXBalanceBefore);
//console.log("USDCXBalanceBefore Formatted", USDCXBalanceBefore / USDCXDivisor);

const TWO_YEAR_FUNDING_PER_YEAR = 1400000n;
const ONE_YEAR_FUNDING_PER_YEAR = 3100000n;
const TOTAL_FUNDING_PER_YEAR = TWO_YEAR_FUNDING_PER_YEAR + ONE_YEAR_FUNDING_PER_YEAR;

// Amount that the ENS DAO wallet has currently approved the Autowrap strategy to spend
// This needs to be increased to cover the entire year of funding + a buffer
// Last year the buffer was 6 months worth of funding
const currentAutowrapUSDCAllowance = await USDCContract.allowance(SENDER_ADDR, AUTOWRAP_STRATEGY_ADDR);

// Amount of USDCx that the Stream Management Pod has currently
// For simplicity either keep this in the multsig or return it to the ENS DAO wallet post execution of this proposal
const currentStreamManagementPodUsdcxBalance = await USDCXContract.balanceOf(STREAM_MANAGEMENT_POD);

// Amount of USDCx that the DAO Wallet has currently wrapped
// For simplicity either keep this in the multsig or return it to the ENS DAO wallet post execution of this proposal
const currentEnsDaoWalletUsdcxBalance = await USDCXContract.balanceOf(SENDER_ADDR);


// Current flowrate of USDCx from the ENS DAO wallet to the Stream Management Pod
const currentUSDCxFlowrate = await SuperfluidContract.getFlowrate(USDCX_ADDR, SENDER_ADDR, STREAM_MANAGEMENT_POD);

console.log("--------------------------------");
console.log("-------- INITIAL STATE ---------");
console.log("CurrentAutowrap USDC Allowance", currentAutowrapUSDCAllowance / USDCDivisor);
console.log("Stream Management Pod Current USDCx Balance", currentStreamManagementPodUsdcxBalance / USDCXDivisor);
console.log("ENS DAO Wallet Current USDCx Balance", currentEnsDaoWalletUsdcxBalance / USDCXDivisor);
console.log("Current USDCxFlowrate (ENS DAO wallet -> Stream Management Pod)", currentUSDCxFlowrate, Number(currentUSDCxFlowrate) / Number(USDCXDivisor));
console.log("--------------------------------");

// We want an upfront allowance of 1 months worth of funding.
const UPFRONT_USDC_ALLOWANCE = (TOTAL_FUNDING_PER_YEAR / 12n);

// 3n / 2n = 1.5 (years) => 18 months
// ERC20 `approve` method replaces the existing allowance with the new one - we don't need to consider existing allowance
// We set the allowance to cover the entire year of funding + a buffer - the amount we wrap up front
const NEW_AUTOWRAP_ALLOWANCE = (TOTAL_FUNDING_PER_YEAR * 3n / 2n) - UPFRONT_USDC_ALLOWANCE;
console.log("NEW_AUTOWRAP_ALLOWANCE", NEW_AUTOWRAP_ALLOWANCE);
assert(NEW_AUTOWRAP_ALLOWANCE === 6375000n, `Autowrap allowance is not 6375000 - ${NEW_AUTOWRAP_ALLOWANCE}`);

// "There are 31,556,926 seconds in a year. While leap years account for most of the drift, 
// you must skip a leap year in years that are divisible by 100 and not divisible by 400 to 
// account for the slight variation. Then we also add leap seconds every now and again. 
// We had one in 2016."
const SECONDS_IN_YEAR = 31556926n;
const USD_PER_SECOND = (TOTAL_FUNDING_PER_YEAR * USDCXDivisor) / SECONDS_IN_YEAR;
assert(USD_PER_SECOND === 142599440769357573n, `USD Per Second is not 142599440769357573 - ${USD_PER_SECOND}`);


console.log("--------------------------------");
console.log("-------- REQUIREMENTS ---------");
console.log("Upfront USDC Allowance", UPFRONT_USDC_ALLOWANCE);
console.log("Required USDCxFlowrate (ENS DAO wallet -> Stream Management Pod)", USD_PER_SECOND, Number(USD_PER_SECOND) / Number(USDCXDivisor));

/**
 * This function approves the Super USDCX contract to spend one months worth of USDC on behalf of the sender, the ENS DAO wallet.
 */
export const approveUSDCX = async () => {
        
    console.log("-------------------");
    console.log("-------------------");
    console.log("1. approveUSDCX");
    console.log("-------------------");
    console.log("-------------------");

    // Check the allowance before. Should be 0.
    const USDCAllowanceBefore = await USDCContract.allowance(SENDER_ADDR, USDCX_ADDR);
    assert(USDCAllowanceBefore === 0n, "USDC Allowance Before is not 0");

    console.log("USDCAllowanceBefore", USDCAllowanceBefore);

    // We need to add the appropriate number of 0's for the USDC contract, 6
    const USDC_ALLOWANCE_AMOUNT = UPFRONT_USDC_ALLOWANCE * USDCDivisor;
   assert(USDC_ALLOWANCE_AMOUNT === 375000000000n, `USDC Allowance Amount is not 375000000000 - ${USDC_ALLOWANCE_AMOUNT}`);

    // Generate the calldata for calling the approve function
    const approveAllowanceArguments = [USDCX_ADDR, USDC_ALLOWANCE_AMOUNT];
    const approveAllowanceCalldata = USDCContract.interface.encodeFunctionData("approve", approveAllowanceArguments);
    
    // Log the calldata
    console.log("-------------------");
    console.log("approveAllowanceArguments");
    console.log("-------------------");
    console.log(approveAllowanceArguments);
    console.log("-------------------");
    console.log("approveAllowanceCalldata");
    console.log("-------------------");
    console.log(approveAllowanceCalldata);
    console.log("-------------------");

    // Send the transaction from the ENS DAO wallet to the USDC contract address
    const approveAllowanceTx = await impersonatedSigner.sendTransaction({
        to: USDC_ADDR,
        from: SENDER_ADDR,
        data: approveAllowanceCalldata,
    });

    const approveReceipt = await approveAllowanceTx.wait();

    //Check that the allowance has been set correctly
    const USDCAllowanceAfter = await USDCContract.allowance(SENDER_ADDR, USDCX_ADDR);
    assert(USDCAllowanceAfter === USDC_ALLOWANCE_AMOUNT, `USDC Allowance After is not ${USDC_ALLOWANCE_AMOUNT}`);

    console.log("USDCAllowanceAfter", USDCAllowanceAfter / USDCDivisor);

    // Format output
    console.log("");
    console.log("");

    // Return the calldata
    return approveAllowanceCalldata;
}

/**
 * This function 'upgrades' 1 months worth of USDC from the ENS DAO wallet/'Timelock' to USDCx.
 * This is possible after setting the allowance in the approveUSDCX function.
 * Afterwards the ENS DAO wallet will have 1 months worth more USDCx, and 1 months worth less USDC.
 */
export const upgradeUSDC = async () => {

    console.log("-------------------");
    console.log("-------------------");
    console.log("2. upgradeUSDC");
    console.log("-------------------");
    console.log("-------------------");

    const USDC_UPGRADE_AMOUNT = UPFRONT_USDC_ALLOWANCE * USDCDivisor;
    assert(USDC_UPGRADE_AMOUNT === 375000000000n, `USDC Upgrade Amount is not 375000000000 - ${USDC_UPGRADE_AMOUNT}`);
    const upgradeUSDCArguments = [USDC_UPGRADE_AMOUNT];
    const upgradeUSDCCalldata = USDCXContract.interface.encodeFunctionData("upgrade", upgradeUSDCArguments);

    // Log the calldata
    console.log("-------------------");
    console.log("upgradeUSDCArguments");
    console.log("-------------------");
    console.log(upgradeUSDCArguments);
    console.log("-------------------");
    console.log("upgradeUSDCCalldata");
    console.log("-------------------");
    console.log(upgradeUSDCCalldata);
    console.log("-------------------");

    // The USDCX balance of the DAO wallet is affected independently of this executable - this could be anything
    const USDCXBalanceBeforeUpgrade = await USDCXContract.balanceOf(SENDER_ADDR);
    //console.log("USDCXBalanceBeforeUpgrade", USDCXBalanceBeforeUpgrade / USDCXDivisor);

    // Send the transaction
    const upgradeUSDCTx = await impersonatedSigner.sendTransaction({
        to: USDCX_ADDR,
        from: SENDER_ADDR,
        data: upgradeUSDCCalldata,
    });

    const upgradeReceipt =  await upgradeUSDCTx.wait();

    upgradeReceipt.logs.forEach((log) => {
        try {
            const parsedLog = USDCXContract.interface.parseLog(log);
            console.log("Parsed Log:", parsedLog.signature, parsedLog.args);
        } catch (error) {
            console.error("Log not related to this contract:", error);
        }
    });

    const USDCXBalanceAfterUpgrade = await USDCXContract.balanceOf(SENDER_ADDR);

    // USDCX has 18 decimals, USDC has 6. The before/after assertion needs to made considering the conversion.
    const USDCX_UPGRADE_AMOUNT = UPFRONT_USDC_ALLOWANCE * USDCXDivisor;
    const USDCX_BALANCE_DIFFERENCE = ((USDCXBalanceBeforeUpgrade + USDCX_UPGRADE_AMOUNT) - USDCXBalanceAfterUpgrade) / USDCXDivisor;
    assert(USDCX_BALANCE_DIFFERENCE == 375000n, "Formatted USDCX Balance After Upgrade is not 100000n");

    // Format output
    console.log("");
    console.log("");

    // Return the calldata
    return upgradeUSDCCalldata;
}

/**
 * This function sets up the stream to the Metagov Stream Management Pod.
 * The flowrate of the Super USDCX token is 0.14259944076935757 USD per second which totals $4,500,000 per year.
 * Calculation: 4,500,000 / 31,556,926 = 0.14259944076935757 USD per second.
 */
export const setFlowrate = async () => {

    console.log("-------------------");
    console.log("-------------------");
    console.log("3. setFlowrate");
    console.log("-------------------");
    console.log("-------------------");

    // Generate the calldata for calling the setFlowrate function
    const setFlowrateArguments =         [
        USDCX_ADDR, 
        STREAM_MANAGEMENT_POD, 
        USD_PER_SECOND
    ];
    const setFlowrateCalldata = SuperfluidContract.interface.encodeFunctionData(
        "setFlowrate", 
        setFlowrateArguments
    );

    // Log the calldata
    console.log("-------------------");
    console.log("setFlowrateArguments");
    console.log("-------------------");
    console.log(setFlowrateArguments);
    console.log("-------------------");
    console.log("setFlowrateCalldata");
    console.log("-------------------");
    console.log(setFlowrateCalldata);
    console.log("-------------------");

    // Send the transaction
    const tx = await impersonatedSigner.sendTransaction({
        to: SUPERFLUID_ADDR,
        from: SENDER_ADDR,
        data: setFlowrateCalldata,
    });

    // Wait for confirmation
    const setFlowrateReceipt = await tx.wait();

    const flowRate = await SuperfluidContract.getFlowrate(USDCX_ADDR, SENDER_ADDR, STREAM_MANAGEMENT_POD);
    assert(flowRate === 142599440769357573n, `Flowrate is not 142599440769357573 - ${flowRate}`);

    // Format output
    console.log("");
    console.log("");

    // Return the calldata
    return setFlowrateCalldata;
}


/**
 * This function SETS the amount of USDC (owned by the ENS DAO wallet/Timelock) that the Autowrap strategy contract is able to spend.
 * The increase is $6,375,000 USDC which covers the remaining funding needs after adding a 6 month buffer and subtracting the upfront allowance.
 * The allowance is explicitly SET replacing the Autowrap strategy used by 
 * '[EP5.2] [Executable] Commence Streams for Service Providers' too.
 */
export const setAutowrapAllowance = async () => {

    console.log("-------------------");
    console.log("-------------------");
    console.log("4. setAutowrapAllowance");
    console.log("-------------------");
    console.log("-------------------");

    // The USDC balance of the DAO wallet is affected independently of this executable - this could be anything
    const USDCAllowanceBefore = await USDCContract.allowance(SENDER_ADDR, AUTOWRAP_STRATEGY_ADDR);
    console.log("Autowrap USDCAllowanceBefore", USDCAllowanceBefore);

    // We need to add the appropriate number of 0's for the USDC contract, 6
    const NEW_AUTOWRAP_ALLOWANCE_AMOUNT = NEW_AUTOWRAP_ALLOWANCE * USDCDivisor;
    assert(NEW_AUTOWRAP_ALLOWANCE_AMOUNT === 6375000000000n, `USDC Allowance Amount is not 6375000000000 - ${NEW_AUTOWRAP_ALLOWANCE_AMOUNT}`);

    // Generate the calldata for calling the approve function
    const setAutowrapAllowanceArguments = [
        AUTOWRAP_STRATEGY_ADDR,
        NEW_AUTOWRAP_ALLOWANCE_AMOUNT
    ];
    const setAutowrapAllowanceCalldata = USDCContract.interface.encodeFunctionData(
        "approve", 
        setAutowrapAllowanceArguments
    );
    
    // Log the calldata
    console.log("-------------------");
    console.log("setAutowrapAllowanceArguments");
    console.log("-------------------");
    console.log(setAutowrapAllowanceArguments);
    console.log("-------------------");
    console.log("setAutowrapAllowanceCalldata");
    console.log("-------------------");
    console.log(setAutowrapAllowanceCalldata);
    console.log("-------------------");


    // Send the transaction from the ENS DAO wallet to the USDC contract address
    const setAutowrapAllowanceTx = await impersonatedSigner.sendTransaction({
        to: USDC_ADDR,
        from: SENDER_ADDR,
        data: setAutowrapAllowanceCalldata,
    });

    const setAutowrapAllowanceReceipt = await setAutowrapAllowanceTx.wait();

    //Check that the allowance has been set correctly
    const USDCAllowanceAfter = await USDCContract.allowance(
        SENDER_ADDR, 
        AUTOWRAP_STRATEGY_ADDR
    );
    console.log("Autowrap USDCAllowanceAfter", USDCAllowanceAfter);
    assert(USDCAllowanceAfter === NEW_AUTOWRAP_ALLOWANCE_AMOUNT, `USDC Allowance After is not correct`);

    // Format output
    console.log("");
    console.log("");

    // Return the calldata
    return setAutowrapAllowanceCalldata;
}
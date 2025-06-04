# EP5.2 Technical Analysis - Service Provider Program Season 1

## Overview

This document provides a comprehensive technical breakdown of EP5.2 (Commence Streams for Service Providers), which established the Service Provider Program Season 1. This analysis is intended to guide the implementation of SPP Season 2.

**Transaction Hash**: [`0x81b6b744ff95090b9d2727e7d5b6c9301e643a9de8305377011c2c5a4f11084a`](https://etherscan.io/tx/0x81b6b744ff95090b9d2727e7d5b6c9301e643a9de8305377011c2c5a4f11084a)

**Execution Date**: February 1, 2024

**From**: ENS DAO Timelock ([`0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7`](https://etherscan.io/address/0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7))

## Raw Transaction Data

**Transaction Type**: Contract Execution (Timelock)

**Gas Used**: 497,829

**Gas Price**: 31.5 Gwei

**Total Cost**: 0.0156816135 ETH

**Success**: ✅ Yes

**Block**: 19133101

**Input Data**: The transaction executed a batched call through the ENS DAO Timelock contract, containing all 5 operations described below.

## Transaction Structure

### Fund Flow Architecture

```
┌─────────────────┐     USDC      ┌──────────────┐     USDCx     ┌──────────────────┐
│   ENS Treasury  │ ─────────────> │ Auto-wrapper │ ─────────────> │ Superfluid Host  │
│ (wallet.ensdao) │                └──────────────┘                └──────────────────┘
└─────────────────┘                                                         │
                                                                   Stream @ 0.1427/sec
                                                                           │
                                                                           ▼
                                                              ┌─────────────────────┐
                                                              │ Stream Management   │
                                                              │      Pod (Safe)     │
                                                              └─────────────────────┘
                                                                           │
                                                    Individual Streams to Providers
                                    ┌──────────────────────────────────────┴────────────┐
                                    │                                                   │
                                    ▼                                                   ▼
                          ┌──────────────────┐                                ┌──────────────────┐
                          │ Provider 1 (1yr) │              ...               │ Provider 8 (2yr) │
                          └──────────────────┘                                └──────────────────┘
```

EP5.2 consisted of 5 sequential operations executed in a single transaction:

### 1. Approve SuperToken Contract (300k USDC)

**Purpose**: Allow the USDCx (Super USDC) contract to wrap initial funds

**Target**: [`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) (USDC)

**Function**: `approve(address spender, uint256 amount)`

**Parameters**:

- `spender`: `0x1BA8603DA702602A8657980e825A6DAa03Dee93a` (USDCx)
- `amount`: `300000000000` (300k USDC with 6 decimals)

**Calldata**:

```
0x095ea7b30000000000000000000000001ba8603da702602a8657980e825a6daa03dee93a00000000000000000000000000000000000000000000000000000045d964b800
```

### 2. Wrap 300k USDC to USDCx

**Purpose**: Convert USDC to Super USDC for streaming

**Target**: [`0x1BA8603DA702602A8657980e825A6DAa03Dee93a`](https://etherscan.io/address/0x1BA8603DA702602A8657980e825A6DAa03Dee93a) (USDCx)

**Function**: `upgrade(uint256 amount)`

**Parameters**:

- `amount`: `300000000000000000000000` (300k with 18 decimals)

**Calldata**:

```
0x45977d03000000000000000000000000000000000000000000003f870857a3e0e3800000
```

**Note**: USDCx uses 18 decimals while USDC uses 6, requiring conversion

### 3. Start Master Stream

**Purpose**: Create stream from Treasury to Stream Management Pod

**Target**: [`0xcfA132E353cB4E398080B9700609bb008eceB125`](https://etherscan.io/address/0xcfA132E353cB4E398080B9700609bb008eceB125) (Superfluid Host)

**Function**: `setFlowrate(address token, address receiver, int96 flowRate)`

**Parameters**:

- `token`: `0x1BA8603DA702602A8657980e825A6DAa03Dee93a` (USDCx)
- `receiver`: `0xB162Bf7A7fD64eF32b787719335d06B2780e31D1` (Stream Management Pod)
- `flowRate`: `114155251141552512` (wei per second)

**Calldata**:

```
0x57e6aa360000000000000000000000001ba8603da702602a8657980e825a6daa03dee93a000000000000000000000000b162bf7a7fd64ef32b787719335d06b2780e31d100000000000000000000000000000000000000000000000001958f989989a980
```

**Flow Rate Calculation**:

- 114155251141552512 wei/second
- = 0.114155251141552512 USDC/second
- = ~9,863.01 USDC/day
- = ~3,600,000 USDC/year

### 4. Approve Auto-wrapper (5.1M USDC)

**Purpose**: Allow auto-wrapper to convert USDC as needed

**Target**: [`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) (USDC)

**Function**: `approve(address spender, uint256 amount)`

**Parameters**:

- `spender`: `0x1D65c6d3AD39d454Ea8F682c49aE7744706eA96d` (Auto-wrapper Manager)
- `amount`: `5100000000000` (5.1M USDC with 6 decimals)

**Calldata**:

```
0x095ea7b30000000000000000000000001d65c6d3ad39d454ea8f682c49ae7744706ea96d000000000000000000000000000000000000000000000000000004a36fb03800
```

### 5. Create Auto-wrap Schedule

**Purpose**: Configure automatic USDC→USDCx conversion

**Target**: [`0x30aE282CF477E2eF28B14d0125aCEAd57Fe1d7a1`](https://etherscan.io/address/0x30aE282CF477E2eF28B14d0125aCEAd57Fe1d7a1) (Auto-wrapper)

**Function**: `createWrapSchedule(address superToken, address strategy, address liquidityToken, uint64 expiry, uint64 lowerLimit, uint64 upperLimit)`

**Parameters**:

- `superToken`: `0x1BA8603DA702602A8657980e825A6DAa03Dee93a` (USDCx)
- `strategy`: `0x1D65c6d3AD39d454Ea8F682c49aE7744706eA96d` (Manager)
- `liquidityToken`: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` (USDC)
- `expiry`: `3000000000` (far future)
- `lowerLimit`: `1814400` seconds (21 days)
- `upperLimit`: `4320000` seconds (50 days)

**Calldata**:

```
0x5626f9e60000000000000000000000001ba8603da702602a8657980e825a6daa03dee93a0000000000000000000000001d65c6d3ad39d454ea8f682c49ae7744706ea96d000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800000000000000000000000000000000000000000000000000000000b2d05e0000000000000000000000000000000000000000000000000000000000001baf80000000000000000000000000000000000000000000000000000000000041eb00
```

## Key Contract Addresses

| Contract              | Address                                                                                                                 | Purpose                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| ENS Treasury          | [`0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7`](https://etherscan.io/address/0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7) | Source of funds            |
| USDC                  | [`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) | Base stablecoin            |
| USDCx                 | [`0x1BA8603DA702602A8657980e825A6DAa03Dee93a`](https://etherscan.io/address/0x1BA8603DA702602A8657980e825A6DAa03Dee93a) | Super Token for streaming  |
| Superfluid Host       | [`0xcfA132E353cB4E398080B9700609bb008eceB125`](https://etherscan.io/address/0xcfA132E353cB4E398080B9700609bb008eceB125) | Stream protocol            |
| Auto-wrapper          | [`0x30aE282CF477E2eF28B14d0125aCEAd57Fe1d7a1`](https://etherscan.io/address/0x30aE282CF477E2eF28B14d0125aCEAd57Fe1d7a1) | Automatic token conversion |
| Stream Management Pod | [`0xB162Bf7A7fD64eF32b787719335d06B2780e31D1`](https://etherscan.io/address/0xB162Bf7A7fD64eF32b787719335d06B2780e31D1) | Intermediate multisig      |

## Auto-wrapper Logic

The auto-wrapper configuration ensures continuous stream funding:

1. **Lower Limit (21 days)**: When the wrapped USDCx balance falls below 21 days of runway, the auto-wrapper triggers
2. **Upper Limit (50 days)**: Each wrap brings the balance up to 50 days of runway
3. **Risk Management**:
   - Superfluid hack exposure: Limited to 50 days of funds
   - Superfluid + Auto-wrapper hack: Limited to 5.1M USDC (approved amount)

## Implementation Timeline

1. **EP5.2 Execution**: February 1, 2024
2. **Initial Buffer**: 300k USDC wrapped (30 days buffer)
3. **Provider Onboarding**: Individual providers completed KYC/agreements
4. **Individual Streams**: Created from Pod to providers as they onboarded

## Security Considerations

1. **Multi-layer Architecture**: Treasury → Pod → Providers
2. **Approval Limits**: Capped at 5.4M total (300k + 5.1M)
3. **Time-based Limits**: Auto-wrapper operates on time windows
4. **Multisig Control**: Pod required 3/5 signatures initially

## Lessons for SPP2

### What Worked Well

1. **Superfluid Protocol**: Reliable for continuous streaming
2. **Auto-wrapper**: Reduced manual intervention
3. **Buffer Management**: 1-month initial buffer was sufficient
4. **Pod Architecture**: Good separation of concerns

### Key Differences for SPP2

1. **Budget**: 3.6M USDC → 4.5M USDC (25% increase)
2. **Provider Count**: 9 → 8 providers
3. **Two-tier System**: 1-year and 2-year commitments
4. **Pod Configuration**: Now 1/2 multisig (Timelock + Metagov)
5. **Continuing Streams**: Must handle transition from SPP1

### Recommended Approach for SPP2

1. **Increase Allowances**:
   - Initial wrap: Scale proportionally (375k USDC)
   - Auto-wrapper: 6.375M USDC (25% increase)
2. **Update Flow Rate**:

   - New rate: ~142694063926940639269 wei/second
   - Equals ~4.5M USDC/year

3. **Scale Auto-wrapper Limits**:

   - Lower: 250,000 USDCx (25% increase)
   - Upper: 625,000 USDCx (25% increase)

4. **Handle Transitions**:
   - Stop SPP1 streams
   - Start SPP2 streams with backdating
   - Adjust buffers for underpayments

## Transaction Construction for SPP2

Following the EP5.2 pattern, SPP2 should execute similar operations with scaled parameters:

1. Approve initial wrap (scaled amount)
2. Wrap initial USDC to USDCx
3. Update master stream rate to Pod
4. Approve auto-wrapper (scaled amount)
5. Update auto-wrapper schedule

The key is maintaining the same architecture while scaling for the new budget and handling the provider transitions smoothly.

## Detailed Transaction Encoding

### Understanding the Calldata Structure

Each function call in EP5.2 follows standard Ethereum ABI encoding:

- First 4 bytes: Function selector (keccak256 hash of function signature)
- Remaining bytes: Encoded parameters (32 bytes each)

### Example Breakdown: approve() function

**Raw Calldata**:

```
0x095ea7b30000000000000000000000001ba8603da702602a8657980e825a6daa03dee93a00000000000000000000000000000000000000000000000000000045d964b800
```

**Decoded**:

- `0x095ea7b3`: Function selector for `approve(address,uint256)`
- `0000000000000000000000001ba8603da702602a8657980e825a6daa03dee93a`: Spender address (padded to 32 bytes)
- `00000000000000000000000000000000000000000000000000000045d964b800`: Amount (300000000000 in hex)

### Flow Rate Precision

The flow rate calculation requires extreme precision:

```
Annual Budget: 3,600,000 USDC
Seconds per year: 31,536,000 (365 × 24 × 60 × 60)
Rate per second: 3,600,000 ÷ 31,536,000 = 0.114155251141552511774 USDC

With 18 decimals: 114155251141552511.774
Rounded: 114155251141552512
```

For SPP2 with 4.5M USDC budget:

```
4,500,000 ÷ 31,536,000 = 0.142694063926940639718 USDC
With 18 decimals: 142694063926940639.718
Rounded: 142694063926940640
```

## Additional Implementation Notes

### Gas Optimization

- EP5.2 used sequential operations in a single transaction
- Total gas used: ~500,000 gas units
- Consider batching through a multicall contract for SPP2

### Error Handling

- Each operation should be checked for success
- Consider implementing emergency pause mechanisms
- Add events for monitoring stream status

### Monitoring and Maintenance

1. **Stream Health Checks**:

   - Monitor USDCx balance in Treasury
   - Track auto-wrapper triggers
   - Verify individual provider streams

2. **Emergency Procedures**:
   - How to pause/stop streams
   - Recovery from failed auto-wraps
   - Handling provider issues

### SPP2 Specific Considerations

1. **USDC Allowance Calculation**:

   Total needed: 7.025M USDC (from README)
   Current remaining: 550,000 USDC (169k allowance + 381k USDCx)
   New allowance needed: 6,475,000 USDC

2. **Transition Timeline**:

   - Stop SPP1 streams on execution day
   - Create SPP2 streams immediately after
   - Use backdating to May 26, 2025 for continuity

3. **Provider-Specific Handling**:
   - 6 continuing providers: Calculate underpayment adjustments
   - 1 new provider (JustaName): Simple backdated stream
   - Track completion of T&Cs for each provider

### Testing Recommendations

1. **Mainnet Fork Testing**:

   - Fork mainnet at current block
   - Execute all transactions
   - Verify stream creation and flow rates
   - Test auto-wrapper triggers

2. **Integration Testing**:

   - Test with small amounts first
   - Verify all contract interactions
   - Check balance calculations

3. **Monitoring Setup**:
   - Stream status dashboard
   - Auto-wrapper trigger alerts
   - Balance threshold warnings

## Contract Verification Links

All contracts used in EP5.2 are verified on Etherscan:

- [USDC Token](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48#code)
- [USDCx Super Token](https://etherscan.io/address/0x1BA8603DA702602A8657980e825A6DAa03Dee93a#code)
- [Superfluid Host](https://etherscan.io/address/0xcfA132E353cB4E398080B9700609bb008eceB125#code)
- [Auto-wrapper](https://etherscan.io/address/0x30aE282CF477E2eF28B14d0125aCEAd57Fe1d7a1#code)

## Conclusion

EP5.2 established a robust streaming infrastructure that has successfully operated for over a year. SPP2 can leverage this proven architecture with appropriate scaling and transition handling. The key is maintaining operational continuity while upgrading the financial parameters.

## Appendix: SPP2 Transaction Construction Example

### JavaScript Example for SPP2 Calldata Generation

```javascript
// Contract addresses (same as SPP1)
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDCx = "0x1BA8603DA702602A8657980e825A6DAa03Dee93a";
const SUPERFLUID_HOST = "0xcfA132E353cB4E398080B9700609bb008eceB125";
const AUTOWRAPPER = "0x30aE282CF477E2eF28B14d0125aCEAd57Fe1d7a1";
const MANAGER = "0x1D65c6d3AD39d454Ea8F682c49aE7744706eA96d";
const POD = "0xB162Bf7A7fD64eF32b787719335d06B2780e31D1";

// SPP2 Parameters
const INITIAL_WRAP = 375_000; // USDC (scaled 25% from 300k)
const AUTOWRAP_ALLOWANCE = 7_500_000; // USDC (for new allowance)
const FLOW_RATE = "142694063926940640"; // wei/second for 4.5M USDC/year

// Transaction 1: Approve initial wrap
const tx1 = {
  to: USDC,
  data: web3.eth.abi.encodeFunctionCall(
    {
      name: "approve",
      type: "function",
      inputs: [
        { type: "address", name: "spender" },
        { type: "uint256", name: "amount" },
      ],
    },
    [USDCx, INITIAL_WRAP * 1e6]
  ), // Convert to 6 decimals
};

// Transaction 2: Wrap USDC to USDCx
const tx2 = {
  to: USDCx,
  data: web3.eth.abi.encodeFunctionCall(
    {
      name: "upgrade",
      type: "function",
      inputs: [{ type: "uint256", name: "amount" }],
    },
    [INITIAL_WRAP * 1e18]
  ), // Convert to 18 decimals
};

// Transaction 3: Update flow rate
const tx3 = {
  to: SUPERFLUID_HOST,
  data: web3.eth.abi.encodeFunctionCall(
    {
      name: "setFlowrate",
      type: "function",
      inputs: [
        { type: "address", name: "token" },
        { type: "address", name: "receiver" },
        { type: "int96", name: "flowRate" },
      ],
    },
    [USDCx, POD, FLOW_RATE]
  ),
};

// Transaction 4: Approve autowrapper
const tx4 = {
  to: USDC,
  data: web3.eth.abi.encodeFunctionCall(
    {
      name: "approve",
      type: "function",
      inputs: [
        { type: "address", name: "spender" },
        { type: "uint256", name: "amount" },
      ],
    },
    [MANAGER, AUTOWRAP_ALLOWANCE * 1e6]
  ),
};

// Transaction 5: Update autowrap schedule
const tx5 = {
  to: AUTOWRAPPER,
  data: web3.eth.abi.encodeFunctionCall(
    {
      name: "createWrapSchedule",
      type: "function",
      inputs: [
        { type: "address", name: "superToken" },
        { type: "address", name: "strategy" },
        { type: "address", name: "liquidityToken" },
        { type: "uint64", name: "expiry" },
        { type: "uint64", name: "lowerLimit" },
        { type: "uint64", name: "upperLimit" },
      ],
    },
    [
      USDCx,
      MANAGER,
      USDC,
      3000000000, // far future
      2268000, // 26.25 days (25% increase from 21)
      5400000, // 62.5 days (25% increase from 50)
    ]
  ),
};
```

### Key Differences from EP5.2

1. **Allowance Structure**: SPP2 needs higher total allowance due to budget increase and two-tier system
2. **Flow Rate**: Precisely calculated for 4.5M USDC annual budget
3. **Buffer Periods**: Scaled proportionally with budget increase
4. **Transition Handling**: Additional logic needed for stopping SPP1 streams

### Verification Checklist

Before executing SPP2:

- [ ] Verify all contract addresses match mainnet
- [ ] Double-check flow rate calculations
- [ ] Confirm auto-wrapper limits are appropriate
- [ ] Test on mainnet fork
- [ ] Review provider transition plan
- [ ] Ensure sufficient USDC balance in treasury
- [ ] Validate all provider wallet addresses
- [ ] Confirm T&C completion status

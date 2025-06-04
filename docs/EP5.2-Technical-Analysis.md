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

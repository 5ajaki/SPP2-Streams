# ENS DAO Service Provider Program Season 2 - Executable Requirements

## Overview

This document outlines the technical requirements for the executable proposal to implement Service Provider Program Season 2, transitioning from the current 3.6M USDC annual budget to the approved 4.5M USDC annual budget.

> **📚 Historical Context**: For details on how SPP1 was implemented, see [SPP1 Technical History](docs/SPP1-History.md)

> **🧮 Calculation Tools**: Underpayment calculators for all providers are available in the [`tools/`](tools/) directory.

## Current Situation

### Stream Architecture

```
ENS Treasury → Stream Management Pod → Individual Service Providers
```

### Current Status

> **Note**: SPP1 streams continue running as planned while providers complete T&Cs and due diligence for SPP2

- **Original approve and wrap**: 300k USDC - 1 months funding (see EP5.2, February 2024)
- **Original autowrap allowance**: 5.1M USDC (see EP5.2, February 2024)
- **Consumed over ~16 months**: ~4.85M USDC (5.4M - 0.55M remaining)
- **Remaining allowance**: 550,000 USDC (169k on auto-wrapper + 381k USDCx in stream)
- **Active streams**: 6 providers continuing at SPP1 rates (3 providers terminated)
- **Current outgoing flow**: ~2.5M USDC/year to providers (reduced from 3.6M USDC)

- **SPP2 program start**: May 26, 2025 (streams enacted individually as paperwork completes)

### Season 2 Composition

- **6 continuing providers** (still receiving SPP1 streams)
  - ETH.LIMO, Namehash Labs, Blockful, Unruggable, Ethereum Identity Foundation, Namespace
- **2 new providers**
  - JustaName and ZK Email
- **Total: 8 providers**
- **Budget: 4.5M USDC annually**
  - **Two-year streams**: 1.4M USDC/year (ETH.LIMO and Blockful)
  - **One-year streams**: 3.1M USDC/year (6 providers)

## Required Transactions

### 1. Set USDC Allowance

**Objective**: Set sufficient allowance for the USDCx contract to spend one months worth of the ENS DAO Wallets USDC

**Calculation**:

- Two-year streams: 1.4M USDC/year
- One-year streams: 3.1M USDC/year
- Total: 4.5M USDC

- One month: 4.5M USDC / 12 => 375k USDC

**Calldata**: [`approveUSDCX`](./test/calldata/test-usdc-stream.js#L113)
**Simulation**: [Tenderly](https://www.tdly.co/shared/simulation/d585f502-bd14-4226-8069-c922a2ae6671)

### 2. Upgrade (Wrap) USDC

**Objectice**: Wrap USDC from the ENS DAO wallet as USDCx to fund one month of streams.

**Calldata**: [`upgradeUSDC`](./test/calldata/test-usdc-stream.js#L174)
**Simulation**: [Tenderly](https://www.tdly.co/shared/simulation/601bb530-c0dc-43d9-a9c6-0c411ab7e1dd)

### 3. Update Superfluid Stream Rate

**Objective**: Increase flow rate from wallet.ensdao.eth to Stream Management Pod

**Current vs New**:

- Current: 0.1141 USDCx/second (~3.6M USDC/year)
- New: 0.1426 USDCx/second (~4.5M USDC/year)
- Increase: 25%

**Calldata**: [`setFlowrate`](./test/calldata/test-usdc-stream.js#L240)
**Simulation**: [Tenderly](https://www.tdly.co/shared/simulation/073a3407-86e8-4f55-b3e7-72a3b5fcb263)

**Note**: This adjusts the flow rate going forward. Underpayments from May 26 to activation date are handled separately.

### 4. Set Autowrap Allowance

**Objective**: Set an appropriate allowance that allows the Superfluid Autowrapper contracts to wrap more ENS DAO wallet USDC to USDCx as required.

**Calldata**: [`setAutowrapAllowance`](./test/calldata/test-usdc-stream.js#L298)
**Simulation**: [Tenderly](https://www.tdly.co/shared/simulation/7bdb6af7-952a-4e3e-98e8-350b6ab149cd)

## Stream Transition Approach

### Overview

All providers will have their SPP2 streams activated as soon as possible, with backpay compensation for the period from May 26, 2025 to activation date.

### Implementation Steps

1. **All providers:**

   - Activate stream at SPP2 rate as soon as paperwork completes
   - Calculate backpay from May 26 to activation date using the tools
   - Send backpay as one-time USDC payment

2. **Backpay calculation differences:**
   - **Returning providers**: Receive the difference between SPP2 and SPP1 rates (since they've been receiving SPP1 streams)
   - **New providers**: Receive the full SPP2 rate for the period (since they haven't been receiving any stream)

### Backpay Calculation Tools

**Available in the [`tools/`](tools/) directory:**

- **Web Calculator**: [`tools/spp2-underpayment-calculator.html`](tools/spp2-underpayment-calculator.html)
- **CLI Tool**: [`tools/underpayment-calc.js`](tools/underpayment-calc.js)

Both tools calculate the exact backpay amount based on:

- Provider's SPP2 rate (and SPP1 rate for returning providers)
- Exact activation date/time
- Time elapsed since May 26, 2025 11:53 PM UTC

**Note**: All providers should review their backpay calculations to ensure accuracy.

### Example Calculation

**Returning Provider (e.g., ETH.LIMO):**

- SPP1 rate: 500k USDC/year, SPP2 rate: 700k USDC/year
- Time elapsed: 10 days
- Daily backpay: 547.95 USDC (700k - 500k)/365
- **Total backpay: 5,479.50 USDC**

**New Provider (e.g., JustaName):**

- SPP2 rate: 300k USDC/year (no SPP1 rate)
- Time elapsed: 10 days
- Daily backpay: 821.92 USDC (300k/365)
- **Total backpay: 8,219.20 USDC**

### Provider Tracking Table

| Provider          | Type      | SPP1 Rate    | SPP2 Rate      | Stream Type | Daily Backpay Rate |
| ----------------- | --------- | ------------ | -------------- | ----------- | ------------------ |
| ETH.LIMO          | Returning | 500,000 USDC | 700,000 USDC   | 2-year      | 547.95 USDC        |
| Namehash Labs     | Returning | 600,000 USDC | 1,100,000 USDC | 1-year      | 1,369.86 USDC      |
| Blockful          | Returning | 300,000 USDC | 700,000 USDC   | 2-year      | 1,095.89 USDC      |
| Unruggable        | Returning | 400,000 USDC | 400,000 USDC   | 1-year      | 0.00 USDC          |
| Ethereum Identity | Returning | 500,000 USDC | 500,000 USDC   | 1-year      | 0.00 USDC          |
| Namespace         | Returning | 200,000 USDC | 400,000 USDC   | 1-year      | 547.95 USDC        |
| JustaName         | New       | N/A          | 300,000 USDC   | 1-year      | 821.92 USDC        |
| ZK Email          | New       | N/A          | 400,000 USDC   | 1-year      | 1,095.89 USDC      |

## Key Contract Addresses

| Contract                         | Address                                                                                                                 | Purpose                    |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| ENS Treasury (wallet.ensdao.eth) | [`0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7`](https://etherscan.io/address/0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7) | Source of funds            |
| USDC Token                       | [`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) | Token being streamed       |
| Stream Management Pod            | [`0xB162Bf7A7fD64eF32b787719335d06B2780e31D1`](https://etherscan.io/address/0xB162Bf7A7fD64eF32b787719335d06B2780e31D1) | Intermediate streaming hub |
| USDCx (Super Token)              | [`0x1ba8603da702602a8657980e825a6daa03dee93a`](https://etherscan.io/address/0x1ba8603da702602a8657980e825a6daa03dee93a) | Superfluid wrapper token   |

## Timeline & Urgency

### Critical Dates

- **EP 6.3 Vote**: February 2025 (approved 4.5M USDC budget and program renewal)
- **EP 6.10 Vote**: May 7-12, 2025 (selected SPP2 providers)
- **SPP2 Target Start**: May 26, 2025 (2 weeks after EP 6.10)
- **Allowance Depletion**: ~August 2025 (at Season 2 rate)

### Implementation Priority

**Standard Practice**: Like SPP1's implementation in February 2024, returning providers continue receiving their existing SPP1 rates while completing paperwork. New providers will have their streams activated once paperwork completes. The backpay compensation method ensures all providers receive their full SPP2 allocation from May 26, 2025 through direct payments.

## Historical Context

### Original Setup (EP5.2)

- **Budget**: 3.6M USDC annually
- **Providers**: 9 selected
- **Allowance**: 5.4M USDC (5.1M + 300k initial wrap)
- **Flow rate**: 0.114155251141552512 USDC/second

### Season 2 Approval (EP 6.3)

- **Budget increase**: 3.6M USDC → 4.5M USDC (+25%)
- **Provider count**: 9 → 8 (6 continuing, 2 new)
- **Selection method**: Ranked choice voting
- **Two-tier funding**:
  - 2 providers on 2-year streams (1.4M USDC/year)
  - 6 providers on 1-year streams (3.1M USDC/year)

## Related Forum Discussions

### Core Proposals

- **[EP 6.3] Service Provider Budget Renewal**: https://discuss.ens.domains/t/[ep-6-3]-social-renew-service-provider-budget/20272
- **[EP 6.10] Service Provider Selection**: [https://snapshot.box/#/s:ens.eth/proposal/0x98c65ac02f738ddb430fcd723ea5852a45168550b3daf20f75d5d508ecf28aa1](https://snapshot.box/#/s:ens.eth/proposal/0x98c65ac02f738ddb430fcd723ea5852a45168550b3daf20f75d5d508ecf28aa1)
- **[Temp Check] Renew Service Providers Program**: https://discuss.ens.domains/t/temp-check-renew-service-providers-program-for-season-2/20149
- **Original EP5.2 Implementation**: https://docs.ens.domains/dao/proposals/5.2

### Program Discussion

- **Service Provider Program Scope**: https://discuss.ens.domains/t/service-provider-program-scope-and-deliverables/20316
- **Season 2 Brain Dump**: https://discuss.ens.domains/t/a-brain-dump-on-service-provider-program-season-2/19929
- **Service Provider Category**: https://discuss.ens.domains/t/about-the-service-provider-category/20335

### Technical Implementation

- **Original Stream Setup**: https://docs.ens.domains/dao/proposals/5.2
- **Superfluid Platform Selection**: Referenced in EP5.2 RFP process
- **Live Dashboard**: https://app.superfluid.org/token/ethereum/0x1ba8603da702602a8657980e825a6daa03dee93a?view=0xB162Bf7A7fD64eF32b787719335d06B2780e31D1

## Next Steps

1. ✅ **Provider allocations confirmed** - SPP2 rates defined in EP 6.10
2. ✅ **Calculation tools ready** - See [`tools/`](tools/) directory
3. ✅ **Contract state verified**:
   - Current USDC allowance: 550,000 USDC (169k on auto-wrapper + 381k USDCx)
   - Current streams: 3.6M USDC/year in, 2.5M USDC/year out (net: 1.1M USDC/year)
   - Superfluid contracts confirmed
4. **Draft executable proposal** with four main transactions:
   - Set USDC allowance for USDCx contract
   - Wrap USDC to USDCx (one month funding)
   - Update master stream rate to 4.5M USDC/year
   - Set autowrap allowance for ongoing operations
5. **Submit for DAO vote** before allowance depletion (~August 2025)
6. **After proposal execution**, for each provider:
   - Calculate exact backpay amount using the tools
   - All providers verify their backpay calculations
   - Execute stream transitions as paperwork completes
   - Send backpay compensations

## Notes

- **Superfluid Architecture**: No upfront capital lockup; streams forward 100% of received funds
- **Risk Management**: Autowrapper limits protect against protocol exploits
- **Governance**: [Stream Management Safe](https://app.safe.global/home?safe=eth:0xB162Bf7A7fD64eF32b787719335d06B2780e31D1) requires 1/2 signatures for changes. The two signers are:
  - ENS DAO [Timelock](https://etherscan.io/address/0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7)
  - ENS DAO [Meta-Governance Working Group Safe](https://etherscan.io/address/0x91c32893216dE3eA0a55ABb9851f581d4503d39b)
- **Implementation Pattern**: Mirrors SPP1 where providers continued receiving funds while completing paperwork
- **Backpay Compensation**: All providers receive backpay payments for the period from May 26, 2025 to stream activation. Returning providers receive the difference between SPP1 and SPP2 rates, while new providers receive the full SPP2 rate for the period.

## Testing/Calldata Generation

- Copy `.env.example` to `.env`
- Set `INFURA_API_KEY`
- (Optional) Set `TENDERLY_API_KEY`, `TENDERLY_USERNAME`, and `TENDERLY_PROJECT` to generate Tenderly simulations.
- Run `bun run test/run-it.js`

---

_This document serves as the technical specification for implementing Service Provider Program Season 2. All calculations and addresses should be verified before proposal submission._

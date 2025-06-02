# ENS DAO Service Provider Program Season 2 - Executable Requirements

## Overview

This document outlines the technical requirements for the executable proposal to implement Service Provider Program Season 2, transitioning from the current $3.6M annual budget to the approved $4.5M annual budget.

> **📚 Historical Context**: For details on how SPP1 was implemented, see [SPP1 Technical History](docs/SPP1-History.md)

> **🧮 Calculation Tools**: Underpayment calculators for continuing providers are available in the [`tools/`](tools/) directory.

## Current Situation

### Stream Architecture

```
ENS Treasury → Stream Management Pod → Individual Service Providers
```

### Current Status (as of June 2, 2025)

> **Note**: SPP1 streams continue running as planned while providers complete T&Cs and due diligence for SPP2

- **Original allowance**: 5.4M USDC (set in EP5.2, February 2024)
- **Consumed over ~16 months**: ~4.5M USDC (estimated)
- **Remaining allowance**: ~0.9M USDC (estimated)
- **Active streams**: 6 providers continuing at SPP1 rates
- **Current flow rate**: ~$2.5M/year (6 active SPP1 streams)
- **SPP2 program start**: May 26, 2025 (streams enacted individually as paperwork completes)

### Season 2 Composition

- **6 continuing providers** (still receiving SPP1 streams)
  - ETH.LIMO, Namehash Labs, Blockful, Unruggable, Ethereum Identity Foundation, Namespace
- **2 new providers**
  - JustaName and ZK Email
- **Total: 8 providers**
- **Budget: $4.5M annually**
  - **Two-year streams**: $1.4M/year (ETH.LIMO and Blockful)
  - **One-year streams**: $3.1M/year (6 providers)

## Required Transactions

### 1. Increase USDC Allowance

**Objective**: Provide sufficient allowance for full program duration plus 6-month buffer

Season 2 has a two-tier funding structure:

- **Two-year streams**: $1.4M/year × 2.5 years (2 years + 6-month buffer) = $3.5M
- **One-year streams**: $3.1M/year × 1.5 years (1 year + 6-month buffer) = $4.65M
- **Total required**: $8.15M USDC
- **Current remaining**: ~$0.9M USDC
- **Additional allowance needed**: ~$7.25M USDC

**Transaction**:

```json
{
  "target": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "value": 0,
  "calldata": ADD_CALLDATA_HERE
}
```

Target: [`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) (USDC Token)

### 2. Update Superfluid Stream Rate

**Objective**: Increase flow rate from wallet.ensdao.eth to Stream Management Pod

- **Current rate**: 0.1141 USDC/second (~$3.6M/year, but effectively $2.5M with 6 providers)
- **New rate**: 0.1427 USDC/second (~$4.5M/year)
- **Increase**: 25% from original rate

> **Note**: With backdating to May 26, 2025, Superfluid will automatically handle the retroactive payment difference when the new stream rate is applied.

### 3. Update Autowrapper Parameters

**Objective**: Scale autowrapper limits for higher flow rate

**Current limits** (from EP5.2):

- Lower limit: 200,000 USDCx
- Upper limit: 500,000 USDCx

**New limits** (25% increase):

- Lower limit: 250,000 USDCx
- Upper limit: 625,000 USDCx

### 4. Enable Backdated Streams

**Consideration**: Streams should start retroactively to ensure full allocation despite administrative delays

## Stream Transition Approach: Managing Overlapping Streams

### The Challenge

- **All SPP2 streams must begin May 26, 2025** (per program rules)
- **Continuing providers keep receiving SPP1 rates** (as planned, while completing paperwork)
- **All providers receive rate increases** in SPP2 (simplifying calculations)

### Solution: Backdating with Underpayment Adjustments

Since all continuing providers receive higher rates in SPP2:

1. **Calculate underpayment** for each continuing provider:
   - Underpayment = (SPP2 rate - SPP1 rate) × days since May 26th
2. **Add underpayment to initial buffer** when starting SPP2 stream
3. **Backdate SPP2 stream** to May 26, 2025 11:53 PM UTC
4. **Result**: Provider receives correct total amount from May 26th

### Implementation Tool

**Underpayment calculators are available in the [`tools/`](tools/) directory:**

- **Web Calculator**: [`tools/spp2-underpayment-calculator.html`](tools/spp2-underpayment-calculator.html) - Visual interface with date/time selection
- **CLI Tool**: [`tools/underpayment-calc.js`](tools/underpayment-calc.js) - Command-line tool for scripting

Both tools calculate the exact underpayment amount based on:

- Provider's SPP1 and SPP2 rates
- Exact activation date/time
- Time elapsed since May 26, 2025 11:53 PM UTC

See the [tools documentation](tools/README.md) for detailed usage instructions.

### Implementation Steps

1. **For each continuing provider, calculate:**

   ```
   Days receiving SPP1 = Enactment date - May 26, 2025
   SPP1 daily rate = Annual SPP1 amount ÷ 365.25
   SPP2 daily rate = Annual SPP2 amount ÷ 365.25
   Daily underpayment = SPP2 daily rate - SPP1 daily rate
   Total underpayment = Days × Daily underpayment
   ```

2. **When executing transitions:**
   - Stop SPP1 stream
   - Calculate standard buffer for SPP2 stream
   - Add underpayment to buffer
   - Start SPP2 stream backdated to May 26, 2025 11:53 PM UTC

### Example Calculation

Provider receiving $500k SPP1, moving to $600k SPP2, transitioning 10 days after May 26th:

- SPP1 daily: $1,369.86
- SPP2 daily: $1,643.84
- Daily underpayment: $273.98
- 10 days underpayment: $2,739.80
- Action: Add $2,739.80 to initial buffer

### Required Information for Execution

To implement the adjusted buffer method, we need:

1. **For each continuing provider:**

   - Current SPP1 annual allocation
   - New SPP2 annual allocation (from EP 6.10)
   - Provider wallet address
   - Standard buffer amount (typically 1-2 months)

2. **Execution timing:**

   - Exact execution date/time
   - Days elapsed since May 26, 2025

3. **New providers:**
   - SPP2 annual allocation
   - Provider wallet address
   - Standard buffer amount

### Provider Adjustment Tracking Table

| Provider          | Type       | SPP1 Rate | SPP2 Rate  | Days Late | Addition | Notes         |
| ----------------- | ---------- | --------- | ---------- | --------- | -------- | ------------- |
| ETH.LIMO          | Continuing | $500,000  | $700,000   | X         | +$X,XXX  | 2-year stream |
| Namehash Labs     | Continuing | $600,000  | $1,100,000 | X         | +$X,XXX  | 1-year stream |
| Blockful          | Continuing | $300,000  | $700,000   | X         | +$X,XXX  | 2-year stream |
| Unruggable        | Continuing | $400,000  | $400,000   | X         | +$0      | Same rate     |
| Ethereum Identity | Continuing | $500,000  | $500,000   | X         | +$0      | Same rate     |
| Namespace         | Continuing | $200,000  | $400,000   | X         | +$X,XXX  | 1-year stream |
| JustaName         | New        | N/A       | $300,000   | N/A       | $0       | Full backdate |
| ZK Email          | New        | N/A       | $400,000   | N/A       | $0       | Full backdate |

## Key Contract Addresses

| Contract                         | Address                                                                                                                 | Purpose                    |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| ENS Treasury (wallet.ensdao.eth) | [`0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7`](https://etherscan.io/address/0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7) | Source of funds            |
| USDC Token                       | [`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) | Token being streamed       |
| Stream Management Pod            | [`0xB162Bf7A7fD64eF32b787719335d06B2780e31D1`](https://etherscan.io/address/0xB162Bf7A7fD64eF32b787719335d06B2780e31D1) | Intermediate streaming hub |
| USDCx (Super Token)              | [`0x1ba8603da702602a8657980e825a6daa03dee93a`](https://etherscan.io/address/0x1ba8603da702602a8657980e825a6daa03dee93a) | Superfluid wrapper token   |

## Timeline & Urgency

### Critical Dates

- **EP 6.3 Vote**: February 2025 (approved $4.5M budget and program renewal)
- **EP 6.10 Vote**: May 7-12, 2025 (selected SPP2 providers)
- **SPP2 Target Start**: May 26, 2025 (2 weeks after EP 6.10)
- **Current Date**: June 2, 2025
- **Allowance Depletion**: ~August 2025 (at Season 2 rate)

### Implementation Priority

**Standard Practice**: Like SPP1's implementation in February 2024, continuing providers continue receiving their existing rates while completing paperwork. The buffer adjustment method ensures all providers receive their full SPP2 allocation from May 26, 2025 through simple underpayment additions.

## Historical Context

### Original Setup (EP5.2)

- **Budget**: $3.6M annually
- **Providers**: 9 selected
- **Allowance**: 5.4M USDC (5.1M + 300k initial wrap)
- **Flow rate**: 0.114155251141552512 USDC/second
- **Autowrapper**: Lower 200k, Upper 500k USDCx

### Season 2 Approval (EP 6.3)

- **Budget increase**: $3.6M → $4.5M (+25%)
- **Provider count**: 9 → 8 (6 continuing, 2 new)
- **Selection method**: Ranked choice voting
- **Two-tier funding**:
  - 2 providers on 2-year streams ($1.4M/year)
  - 6 providers on 1-year streams ($3.1M/year)

## Calculations Reference

### Flow Rate Conversion

```
Annual Budget → Per Second Rate
$4.5M ÷ (365.25 × 24 × 3600) ≈ 0.1427 USDC/second

Superfluid Precision:
- Rates must be in wei per second (18 decimals)
- $4.5M/year = 142694063926940639269 wei/second
- Use exact values to avoid rounding errors
```

### Allowance Requirements

```
Two-year streams (with 6-month buffer): $1.4M × 2.5 = $3.5M
One-year streams (with 6-month buffer): $3.1M × 1.5 = $4.65M
Total required: $8.15M
Current remaining: ~$0.9M
Additional needed: ~$7.25M

Note: Backdating handles all payment differentials automatically
```

### Autowrapper Scaling

```
Original limits designed for $3.6M rate
Season 2 is 25% increase ($4.5M ÷ $3.6M = 1.25)
Scale limits by same factor: 200k → 250k, 500k → 625k
```

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

1. **Confirm SPP2 provider allocations** from EP 6.10 results
2. **Map 6 continuing providers** to their SPP1 and SPP2 allocations
3. ✅ **Calculation tools ready** - See [`tools/`](tools/) directory
4. **Calculate adjustment amounts** for each continuing provider as they complete paperwork
5. **Draft executable proposal** with specific calldata
6. **Verify contract addresses** and current balances
7. **Submit for DAO vote** with adequate time before allowance depletion
8. **Execute transitions individually** as providers complete requirements

## Notes

- **Superfluid Architecture**: No upfront capital lockup; streams forward 100% of received funds
- **Risk Management**: Autowrapper limits protect against protocol exploits
- **Governance**: [Stream Management Safe](https://app.safe.global/home?safe=eth:0xB162Bf7A7fD64eF32b787719335d06B2780e31D1) requires 1/2 signatures for changes. The two signers are:
  - ENS DAO [Timelock](https://etherscan.io/address/0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7)
  - ENS DAO [Meta-Governance Working Group Safe](https://etherscan.io/address/0x91c32893216dE3eA0a55ABb9851f581d4503d39b)
- **Implementation Pattern**: Mirrors SPP1 where providers continued receiving funds while completing paperwork
- **Backdating**: All SPP2 streams backdated to May 26, 2025; continuing providers receive buffer additions for underpayments

---

_This document serves as the technical specification for implementing Service Provider Program Season 2. All calculations and addresses should be verified before proposal submission._

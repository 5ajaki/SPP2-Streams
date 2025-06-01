# ENS DAO Service Provider Program Season 2 - Executable Requirements

## Overview
This document outlines the technical requirements for the executable proposal to implement Service Provider Program Season 2, transitioning from the current $3.6M annual budget to the approved $4.5M annual budget.

## Current Situation

### Stream Architecture
```
ENS Treasury → Stream Management Pod → Individual Service Providers
```

### Current Status (May 26, 2025)
- **Original allowance**: 5.4M USDC (set in EP5.2, February 2024)
- **Consumed over 15.8 months**: ~4.4M USDC
- **Remaining allowance**: ~1.0M USDC
- **Current active streams**: 6 providers (after 3 terminations)
- **Current flow rate**: ~$2.4M/year
- **Time remaining**: ~2.7 months at Season 2 rate


### Season 2 Composition
- **6 returning providers**
- **2 new providers**
- **Total: 8 providers**
- **Budget: $4.5M annually**

## Required Transactions

### 1. Increase USDC Allowance
**Objective**: Provide sufficient allowance for 18+ months of operation

- **Current remaining**: ~1.0M USDC
- **Required for 18 months**: $4.5M ÷ 12 × 18 = 6.75M USDC
- **Additional allowance needed**: ~5.75M USDC

**Transaction**:
```json
{
  "target": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "value": 0,
  "calldata": ADD_CALLDATA_HERE
}
```

### 2. Update Superfluid Stream Rate
**Objective**: Increase flow rate from wallet.ensdao.eth to Stream Management Pod

- **Current rate**: 0.1141 USDC/second (~$3.6M/year, but effectively $2.4M with 6 providers)
- **New rate**: 0.1427 USDC/second (~$4.5M/year)
- **Increase**: 25% from original rate

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

## Key Contract Addresses

| Contract | Address | Purpose |
|----------|---------|---------|
| ENS Treasury (wallet.ensdao.eth) | `0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7` | Source of funds |
| USDC Token | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` | Token being streamed |
| Stream Management Pod | `0xB162Bf7A7fD64eF32b787719335d06B2780e31D1` | Intermediate streaming hub |
| USDCx (Super Token) | `0x1ba8603da702602a8657980e825a6daa03dee93a` | Superfluid wrapper token |

## Timeline & Urgency

### Critical Dates
- **EP 6.3 Vote**: February 2025 (approved $4.5M budget)
- **Season 2 Begins**: ~May 26th, 2025 (2 weeks after vote)
- **Allowance Depletion**: ~August 2025 (at Season 2 rate)

### Implementation Priority
**Medium Priority**: 2.7 months remaining provides adequate time for proper proposal drafting and DAO voting process.

## Historical Context

### Original Setup (EP5.2)
- **Budget**: $3.6M annually
- **Providers**: 9 selected
- **Allowance**: 5.4M USDC (5.1M + 300k initial wrap)
- **Flow rate**: 0.114155251141552512 USDC/second
- **Autowrapper**: Lower 200k, Upper 500k USDCx

### Season 2 Approval (EP 6.3)
- **Budget increase**: $3.6M → $4.5M (+25%)
- **Provider count**: 9 → 8 (6 returning, 2 new)
- **Selection method**: Ranked choice voting
- **Two-tier funding**: 1-year and 2-year streams

## Calculations Reference

### Flow Rate Conversion
```
Annual Budget → Per Second Rate
$4.5M ÷ (365.25 × 24 × 3600) ≈ 0.1427 USDC/second
```

### Allowance Requirements
```
18-month runway: $4.5M ÷ 12 × 18 = $6.75M
Current remaining: ~$1.0M
Additional needed: ~$5.75M
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

1. **Draft executable proposal** with specific calldata
2. **Verify contract addresses** and current state
3. **Calculate precise allowance increases** needed
4. **Submit for DAO vote** with adequate time before allowance depletion
5. **Coordinate with Season 2 providers** for stream activation timing

## Notes

- **Superfluid Architecture**: No upfront capital lockup; streams forward 100% of received funds
- **Risk Management**: Autowrapper limits protect against protocol exploits
- **Governance**: [Stream Management Safe](https://app.safe.global/home?safe=eth:0xB162Bf7A7fD64eF32b787719335d06B2780e31D1) requires 1/2 Signatures for changes.  The two signers are:
    - ENS DAO [Meta-Governnace Working Group Safe](https://etherscan.io/address/0x91c32893216dE3eA0a55ABb9851f581d4503d39b)
    - ENS DAO [Timelock](https://etherscan.io/address/0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7)
- **Backdating**: Enables fair allocation despite administrative timing delays

---

*This document serves as the technical specification for implementing Service Provider Program Season 2. All calculations and addresses should be verified before proposal submission.*

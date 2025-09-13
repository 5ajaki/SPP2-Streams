# SPP2 Stream Reactivation - Backpay Calculations

## Executive Summary

This document details the calculation of backpay owed to Service Provider Program Season 2 (SPP2) recipients following the stream interruption caused by the Superfluid AutoWrap system failure in August 2025. The streams were successfully reactivated on September 12, 2025, and all providers are now owed retroactive payments for the interruption period.

## Timeline of Events

### Critical Dates

1. **SPP2 Program Start**: May 26, 2025 at 23:53:00 UTC
2. **Treasury Stream Liquidation**: August 8, 2025 at 18:28:00 UTC (20:28 CEST)
   - ENS DAO treasury to Stream Management Pod stream stopped
3. **Provider Streams Liquidation**: August 9, 2025 at 21:24:00 UTC (23:24 CEST)
   - All provider streams from Management Pod stopped
4. **Executable Proposal Passed**: September 10, 2025 at 17:02:00 UTC (01:02 PM Eastern)
   - [Tally Proposal](https://www.tally.xyz/gov/ens/proposal/8152144177729545927999296682104713773450687318641051882785083122565237294645)
5. **Streams Reactivated**: September 12, 2025 at 15:12:35 UTC
   - [Safe Transaction](https://app.safe.global/transactions/tx?safe=eth:0x91c32893216dE3eA0a55ABb9851f581d4503d39b&id=multisig_0x91c32893216dE3eA0a55ABb9851f581d4503d39b_0x5effc3728d4aee508d1205551e07d13e59ecb13169fbaca453e7c82009e21224)
6. **Namehash Rate Correction**: September 12, 2025 at 22:02:11 UTC
   - [Safe Transaction](https://app.safe.global/transactions/tx?safe=eth:0x91c32893216dE3eA0a55ABb9851f581d4503d39b&id=multisig_0x91c32893216dE3eA0a55ABb9851f581d4503d39b_0x004adb25724058c342f07283c969be8bc92f596b95ad84aebe9010a9b85799c9)

## Stream Interruption Period

**Total Downtime**: August 9, 2025 21:24:00 UTC to September 12, 2025 15:12:35 UTC

- **Duration**: 33 days, 17 hours, 48 minutes, 35 seconds
- **Decimal Days**: 33.7421 days

## Background: Superfluid AutoWrap Failure

As documented in the [Superfluid Post Mortem](https://superfluidorg.notion.site/AutoWrap-System-Failure-August-2025-24f4b6e22ae98044bad6e55f7f200e0f):

> On the 8th of August 2025 at 20:28 CEST the funding stream from ENS DAO treasury to the stream.mg.wg.ens.eth wallet was liquidated due to the ENS DAO treasury USDCx balance being fully depleted. Subsequently on the 9th of August 2025 at 23:24 CEST the ongoing streams from stream.mg.wg.ens.eth to service providers were liquidated due to full depletion of the USDCx balance.

The failure occurred due to an internal service migration at Superfluid and the lack of monitoring for the backup automation service. Superfluid has committed to fully refunding all liquidation fees incurred by ENS wallets during this incident.

## Reactivation Process

The reactivation was accomplished through the [executable proposal](https://discuss.ens.domains/t/executable-reactivate-spp2-streams/21290) which:

1. **Approved 500,000 USDC** to the USDCx contract for conversion
2. **Wrapped 500,000 USDC into USDCx** to provide liquidity
3. **Transferred 400,000 USDCx** to the Stream Management Pod as retroactive payment
4. **Recreated the stream** at the approved rate of 0.142599440769357573 USDCx/sec (~$4.5M/year)

## Backpay Calculations

### Calculation Methodology

Backpay is calculated using the formula:

```
Backpay = (Annual Rate / 365) × Days of Downtime
```

Where:

- **Annual Rate** = Provider's SPP2 allocation
- **Days of Downtime** = 33.7421 days (standard calculation)

### Standard Backpay Amounts

| Provider          | SPP2 Annual Rate | Daily Rate     | Backpay Owed    |
| ----------------- | ---------------- | -------------- | --------------- |
| ETH.LIMO          | $700,000         | $1,917.81      | **$64,710.94**  |
| Namehash Labs     | $1,100,000       | $3,013.70      | **$101,688.57** |
| Blockful          | $700,000         | $1,917.81      | **$64,710.94**  |
| Unruggable        | $400,000         | $1,095.89      | **$36,977.63**  |
| Ethereum Identity | $500,000         | $1,369.86      | **$46,221.95**  |
| Namespace         | $400,000         | $1,095.89      | **$36,977.63**  |
| JustaName         | $300,000         | $821.92        | **$27,733.31**  |
| ZK Email          | $400,000         | $1,095.89      | **$36,977.63**  |
| **TOTAL**         | **$4,500,000**   | **$12,328.77** | **$415,998.60** |

### Namehash Rate Correction Adjustment

Namehash's stream was initially reactivated at $1,000,000/year instead of the correct $1,100,000/year. This was corrected on September 12, 2025 at 22:02:11 UTC.

**Additional calculation for Namehash:**

- Period at incorrect rate: September 12, 15:12:35 to 22:02:11 UTC
- Duration: 6 hours, 49 minutes, 36 seconds (0.2844 days)
- Rate difference: $100,000/year
- Daily difference: $273.97
- **Additional backpay for Namehash: $77.92** ($273.97 × 0.2844)

### Final Backpay Summary

| Provider          | Standard Backpay | Adjustment | Total Backpay   |
| ----------------- | ---------------- | ---------- | --------------- |
| ETH.LIMO          | $64,710.94       | -          | **$64,710.94**  |
| Namehash Labs     | $101,688.57      | $77.92     | **$101,766.49** |
| Blockful          | $64,710.94       | -          | **$64,710.94**  |
| Unruggable        | $36,977.63       | -          | **$36,977.63**  |
| Ethereum Identity | $46,221.95       | -          | **$46,221.95**  |
| Namespace         | $36,977.63       | -          | **$36,977.63**  |
| JustaName         | $27,733.31       | -          | **$27,733.31**  |
| ZK Email          | $36,977.63       | -          | **$36,977.63**  |
| **TOTAL**         | **$415,998.60**  | **$77.92** | **$416,076.52** |

## Implementation Steps

### Completed Actions

✅ Executable proposal passed and executed (September 10, 2025)
✅ Main stream from Treasury to Management Pod reactivated
✅ Provider streams reactivated (September 12, 2025)
✅ Namehash stream rate corrected (September 12, 2025)

## Tools and Resources

### Calculation Tools

- **Reactivation Calculator**: [`reactivation-backpay-calculator.js`](./reactivation-backpay-calculator.js)
  - Usage: `node reactivation-backpay-calculator.js` to see all providers
  - Usage: `node reactivation-backpay-calculator.js <provider>` for specific provider

### Key Addresses

- **ENS Treasury**: `0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7`
- **Stream Management Pod**: `0xB162Bf7A7fD64eF32b787719335d06B2780e31D1`
- **Meta-governance Safe**: `0x91c32893216dE3eA0a55ABb9851f581d4503d39b`
- **USDCx Token**: `0x1BA8603DA702602A8657980e825A6DAa03Dee93a`

### References

- [Executable Proposal Discussion](https://discuss.ens.domains/t/executable-reactivate-spp2-streams/21290)
- [Superfluid Post Mortem](https://superfluidorg.notion.site/AutoWrap-System-Failure-August-2025-24f4b6e22ae98044bad6e55f7f200e0f)
- [Tally Proposal](https://www.tally.xyz/gov/ens/proposal/8152144177729545927999296682104713773450687318641051882785083122565237294645)
- [Stream Reactivation Transaction](https://app.safe.global/transactions/tx?safe=eth:0x91c32893216dE3eA0a55ABb9851f581d4503d39b&id=multisig_0x91c32893216dE3eA0a55ABb9851f581d4503d39b_0x5effc3728d4aee508d1205551e07d13e59ecb13169fbaca453e7c82009e21224)

## Notes

- All calculations use a 365-day year for consistency with the original SPP implementation
- Amounts are rounded to 2 decimal places for USDC transfers
- Superfluid has committed to covering all liquidation fees separately
- The 400,000 USDCx transferred to the Management Pod as part of the reactivation should cover the majority of the backpay obligations

---

_Last Updated: September 13, 2025_
_Prepared by: ENS Meta-governance Working Group_

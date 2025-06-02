# Service Provider Program Season 1 (SPP1) - Technical History

## Overview

The Service Provider Program Season 1 was implemented through **EP5.2** in February 2024, establishing the foundational stream architecture that SPP2 builds upon.

## Key Implementation Details

### Budget and Providers

- **Total Annual Budget**: $3.6M USDC
- **Implementation Date**: February 1, 2024
- **Proposal**: [EP5.2 - Commence Streams for Service Providers](https://docs.ens.domains/dao/proposals/5.2)
- **Execution Transaction**: [`0x81b6b744ff95090b9d2727e7d5b6c9301e643a9de8305377011c2c5a4f11084a`](https://etherscan.io/tx/0x81b6b744ff95090b9d2727e7d5b6c9301e643a9de8305377011c2c5a4f11084a)

### Original Service Providers (9 total)

| Service Provider         | Annual Stream |
| ------------------------ | ------------- |
| ETH.LIMO                 | $500,000      |
| NameHash Labs            | $600,000      |
| Resolverworks.eth        | $700,000      |
| Blockful                 | $300,000      |
| Unruggable               | $400,000      |
| Wildcard Labs            | $200,000      |
| Ethereum Follow Protocol | $500,000      |
| Namespace                | $200,000      |
| UNICORN.ETH              | $200,000      |

### Technical Architecture

#### Stream Management Pod

- **Type**: Gnosis Safe (Global.Safe) wallet
- **Address**: [`0xB162Bf7A7fD64eF32b787719335d06B2780e31D1`](https://etherscan.io/address/0xB162Bf7A7fD64eF32b787719335d06B2780e31D1)
- **Initial Configuration**: 3/5 multisig
  - 3 Metagov Stewards
  - ENS DAO Secretary
  - DAO Governor contract
- **Final Configuration**: 1/2 multisig (changed May 16, 2025)
  - ENS DAO Timelock ([`0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7`](https://etherscan.io/address/0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7))
  - ENS DAO Metagov Safe ([`0x91c32893216dE3eA0a55ABb9851f581d4503d39b`](https://etherscan.io/address/0x91c32893216dE3eA0a55ABb9851f581d4503d39b))

**Note**: The transition to 1/2 signatures ensures the DAO Timelock has full control over the streaming infrastructure, allowing either the Timelock or Metagov Safe to execute transactions independently.

#### Streaming Platform: Superfluid

- **Technology**: Superfluid Protocol for real-time USDC streaming
- **Stream Rate**: 0.114155251141552512 USDC per second (~$3.6M/year)
- **Token**: USDCx (Super USDC with 18 decimals)

### Transaction Flow (EP5.2 Execution)

1. **Approve SuperToken**: Allowed USDCx contract to transfer 300k USDC
2. **Wrap Initial USDC**: Converted 300k USDC to USDCx (one month buffer)
3. **Start Master Stream**: Initiated stream from Treasury to Management Pod
4. **Approve Auto-wrapper**: Allowed auto-wrapper to manage 5.1M USDC
5. **Enable Auto-wrap**: Set automatic wrapping with:
   - Lower limit: 200,000 USDC
   - Upper limit: 500,000 USDC

### Auto-wrapper Configuration

- **Purpose**: Reduce smart contract risk by limiting exposure
- **Operation**: Automatically wraps USDC to USDCx when balance falls below threshold
- **Security**:
  - If Superfluid is compromised: Maximum loss ~50 days of funds
  - If both Superfluid AND auto-wrapper compromised: Maximum loss 18 months

### Original Transaction Details

```solidity
// Key addresses
USDC: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
USDCx (Super USDC): 0x1BA8603DA702602A8657980e825A6DAa03Dee93a
Superfluid Host: 0xcfA132E353cB4E398080B9700609bb008eceB125
Auto-wrapper: 0x30aE282CF477E2eF28B14d0125aCEAd57Fe1d7a1
Stream Management Pod: 0xB162Bf7A7fD64eF32b787719335d06B2780e31D1
```

**Contract Links:**

- USDC: [`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
- USDCx: [`0x1BA8603DA702602A8657980e825A6DAa03Dee93a`](https://etherscan.io/address/0x1BA8603DA702602A8657980e825A6DAa03Dee93a)
- Superfluid Host: [`0xcfA132E353cB4E398080B9700609bb008eceB125`](https://etherscan.io/address/0xcfA132E353cB4E398080B9700609bb008eceB125)
- Auto-wrapper: [`0x30aE282CF477E2eF28B14d0125aCEAd57Fe1d7a1`](https://etherscan.io/address/0x30aE282CF477E2eF28B14d0125aCEAd57Fe1d7a1)
- Stream Management Pod: [`0xB162Bf7A7fD64eF32b787719335d06B2780e31D1`](https://etherscan.io/address/0xB162Bf7A7fD64eF32b787719335d06B2780e31D1)

### Key Learnings from SPP1

1. **Stream Architecture Success**: The Treasury → Pod → Providers model worked well
2. **Provider Changes**: 3 providers were terminated during the program
3. **Budget Utilization**: ~$4.4M consumed over 15.8 months
4. **Allowance Management**: Original 5.4M allowance proved sufficient but needs renewal

### Transition to SPP2

- SPP1 streams continue until May 26, 2025
- SPP2 increases budget to $4.5M annually (25% increase)
- Two-tier system introduced (1-year and 2-year commitments)
- Same technical architecture to be maintained with scaled parameters

## Individual Provider Stream Implementation

### Provider Addresses and Flow Rates

Based on actual Safe transactions from January-February 2024:

| Service Provider            | Recipient Address                                                                                                       | Flow Rate (per second) | Annual Amount | Stream Creation Tx                                                                                                                                                 |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ETH.LIMO                    | [`0xE2Cded674643743ec1316858dFD4FD2116932E63`](https://etherscan.io/address/0xE2Cded674643743ec1316858dFD4FD2116932E63) | 15854895991882293      | ~$500,000     | [`0x4d81836c575bd9821ea18731dde098933c7c6eefb4735c119a29d2f85c712b50`](https://etherscan.io/tx/0x4d81836c575bd9821ea18731dde098933c7c6eefb4735c119a29d2f85c712b50) |
| NameHash Labs               | [`0xa342bc613803978c7e664f59cec78f437b147854`](https://etherscan.io/address/0xa342bc613803978c7e664f59cec78f437b147854) | 19025875190258751      | ~$600,000     | [`0x59a0046426ab50c4af51fb4c78fe3bd2574fdf5546617b2d1f05977e85328101`](https://etherscan.io/tx/0x59a0046426ab50c4af51fb4c78fe3bd2574fdf5546617b2d1f05977e85328101) |
| Resolverworks.eth           | [`0xee9a6bcec9aadcc883bd52b2c9a75fb098991000`](https://etherscan.io/address/0xee9a6bcec9aadcc883bd52b2c9a75fb098991000) | 22196854388635210      | ~$700,000     | [`0xcd5373eabc67c1c7360635ae99f7097cc428e8e2e55f600f2eaeb996a4548195`](https://etherscan.io/tx/0xcd5373eabc67c1c7360635ae99f7097cc428e8e2e55f600f2eaeb996a4548195) |
| Unruggable                  | [`0x4dC96AAd2Daa3f84066F3A00EC41Fd1e88c8865A`](https://etherscan.io/address/0x4dC96AAd2Daa3f84066F3A00EC41Fd1e88c8865A) | 19025875190258751      | ~$600,000     | [`0x0f2c19b4fe105ce087c8b4a161e8ab8ed56cc308cb51f28cfb3246c6c48866ff`](https://etherscan.io/tx/0x0f2c19b4fe105ce087c8b4a161e8ab8ed56cc308cb51f28cfb3246c6c48866ff) |
| Blockful                    | [`0xB352bB4E2A4f27683435f153A259f1B207218b1b`](https://etherscan.io/address/0xB352bB4E2A4f27683435f153A259f1B207218b1b) | 9512937595129375       | ~$300,000     | [`0x6fe6cd59991b33f2a102c3a9f68b42d897dd7237cb85fffe138daf9aaae509c1`](https://etherscan.io/tx/0x6fe6cd59991b33f2a102c3a9f68b42d897dd7237cb85fffe138daf9aaae509c1) |
| Ethereum Follow Protocol    | [`0x64Ca550F78d6Cc711B247319CC71A04A166707Ab`](https://etherscan.io/address/0x64Ca550F78d6Cc711B247319CC71A04A166707Ab) | 15854895991882293      | ~$500,000     | [`0x8715925ddcf0f23bc105b620fa016b9cb60a83c78a92278092c12149fbd5806b`](https://etherscan.io/tx/0x8715925ddcf0f23bc105b620fa016b9cb60a83c78a92278092c12149fbd5806b) |
| Wildcard Labs               | [`0xAAA6E2E683a128B34390B2985B4Ae4e7b42935f0`](https://etherscan.io/address/0xAAA6E2E683a128B34390B2985B4Ae4e7b42935f0) | 6341958396752917       | ~$200,000     | [`0x140a6d2eb1544ad5c54ee99df89b02a97329eed4b7dcdb808d5e9b7252a92923`](https://etherscan.io/tx/0x140a6d2eb1544ad5c54ee99df89b02a97329eed4b7dcdb808d5e9b7252a92923) |
| Namespace                   | [`0x168CAfEcFBE97dF85968Ea039CC11D10a9A44567`](https://etherscan.io/address/0x168CAfEcFBE97dF85968Ea039CC11D10a9A44567) | 6341958396752917       | ~$200,000     | [`0x9cf360ccdfadeebe50e55c8659a98c153893d4b8b9c343e2e75ae3285818e5df`](https://etherscan.io/tx/0x9cf360ccdfadeebe50e55c8659a98c153893d4b8b9c343e2e75ae3285818e5df) |
| General Magic (UNICORN.ETH) | [`0xc8D65E1Bd67f16522e3117B980E1c9D2CaeB9dC3`](https://etherscan.io/address/0xc8D65E1Bd67f16522e3117B980E1c9D2CaeB9dC3) | 6341958396752917       | ~$200,000     | [`0xc2511e6e2d840847842be70c3403b7437a54bd3a6b6578ff60302df78de5816e`](https://etherscan.io/tx/0xc2511e6e2d840847842be70c3403b7437a54bd3a6b6578ff60302df78de5816e) |

### Stream Creation Process

1. **Initial Buffer Transfer**: Each provider received a USDCx buffer (typically 1-2 months)
2. **Stream Activation**: Superfluid createFlow() called to start continuous streaming
3. **Management**: Streams managed through Stream Management Pod multisig

### Provider Changes During SPP1

During the 15.8-month SPP1 period, three providers were terminated:

- General Magic (UNICORN.ETH) - Stream end date set to May 26, 2025
- Wildcard Labs - Stream end date set to May 26, 2025
- Resolverworks.eth (also known as Namestone) - Stream end date set to May 26, 2025

These termination transactions were executed on May 24, 2025 (2 days before the end date) to ensure streams concluded on May 26, 2025, aligning with the overall SPP1 program end date. This reduced the active providers from 9 to 6, with the flow rate decreasing from $3.6M/year to ~$2.4M/year for the remaining providers.

### Lessons for SPP2

1. **Buffer Management**: Initial buffer transfers proved important for stream stability
2. **Flow Rate Precision**: Using 18 decimal precision allowed exact annual amounts
3. **Multisig Operations**: 3/5 threshold worked well for operational flexibility
4. **Stream Termination**: End dates can be set for graceful stream termination

# SPP2 Contract State Verification Report

_Generated: November 28, 2024_

## Current State Verified

### 1. ENS Treasury Balance

- **Address**: `0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7` (wallet.ensdao.eth)
- **ETH Balance**: 2,590.24 ETH ✅
- **USDC Transfers**: Active (recent transfers to Metagov Safe and others)

### 2. Stream Management Pod Activity

- **Address**: `0xB162Bf7A7fD64eF32b787719335d06B2780e31D1`
- **Recent Activity**:
  - May 24, 2025: Ended streams for Namestone and Wildcard Labs
  - May 24, 2025: Set end date for General Magic stream
  - May 16, 2025: Updated Safe signers (now ENS DAO Timelock + Metagov Safe)
- **Status**: Actively managing SPP1 wind-down ✅

### 3. Stream Architecture Confirmed

- **Flow**: ENS Treasury → Stream Management Pod → Individual Providers
- **Autowrapper Active**: Yes (address: `0x1d65c6d3ad39d454ea8f682c49ae7744706ea96d`)
- **Recent autowrap**: 493,150.68 USDC on April 30, 2025

## Items Requiring Manual Verification

### 1. Current USDC Allowance

**Need to check on Etherscan**:

- Go to [USDC Token Contract](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48#readContract)
- Use "Read Contract" → `allowance`
- Owner: `0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7`
- Spender: `0xB162Bf7A7fD64eF32b787719335d06B2780e31D1`

### 2. Current Stream Configuration

**Check on Superfluid Dashboard**:

- [View Stream Management Pod](https://app.superfluid.finance/token/ethereum/0x1ba8603da702602a8657980e825a6daa03dee93a?view=0xB162Bf7A7fD64eF32b787719335d06B2780e31D1)
- Verify current flow rate from ENS Treasury
- Check active outgoing streams to providers

### 3. Superfluid Contract Addresses

**Verify for the proposal**:

- CFAv1 Forwarder contract address
- Autowrapper contract address
- Current configuration parameters

## Summary

✅ **Verified**:

- ENS Treasury is well-funded
- Stream Management Pod is operational
- Safe signers are correct (Timelock + Metagov)
- SPP1 providers are being wound down

⚠️ **Need Manual Check**:

- Exact USDC allowance remaining
- Current Superfluid flow rates
- Specific contract addresses for transactions

## Next Action

Use the Etherscan and Superfluid dashboard links above to complete the verification before drafting the executable proposal.

# SPP2 Backpay Calculation Tools

This directory contains two tools for calculating backpay owed to all providers between the SPP2 start date (May 26, 2025 11:53 PM UTC) and when their stream is activated.

## Why Backpay Calculations?

All providers are entitled to SPP2 rates starting May 26, 2025 at 11:53 PM UTC. However, their actual streams will be activated as paperwork completes. These tools calculate the backpay compensation for that gap period.

**The calculation differs by provider type:**

- **Returning providers**: Backpay = (SPP2 rate - SPP1 rate) × time elapsed
- **New providers**: Backpay = SPP2 rate × time elapsed

All providers should review their backpay calculations to ensure accuracy.

## Tools Available

### 1. Web-based Calculator (`spp2-underpayment-calculator.html`)

A simple, visual calculator that runs in any web browser.

**Features:**

- Pre-populated provider data
- **Date AND time selection** for precise calculations
- Visual results display
- Automatic timezone conversion to UTC
- Shows time period in days and hours
- Clear indication when no underpayment is owed

**How to use:**

```bash
# Open in browser
open spp2-underpayment-calculator.html
# or
python3 -m http.server 8000
# then visit http://localhost:8000/spp2-underpayment-calculator.html
```

### 2. Command Line Tool (`underpayment-calc.js`)

A Node.js script for quick calculations from the terminal.

**Features:**

- Fast command-line interface
- **Supports multiple datetime formats**
- Scriptable for automation
- Precise hour-level calculations
- Clear output showing calculation breakdown

**How to use:**

```bash
# Make executable
chmod +x underpayment-calc.js

# Show help
node underpayment-calc.js

# Calculate with just date (assumes midnight UTC)
node underpayment-calc.js ethlimo 2025-06-15

# Calculate with specific time
node underpayment-calc.js namespace 2025-06-10T15:45
node underpayment-calc.js blockful "2025-06-08 09:30"
```

### Date/Time Format Examples

- `2025-06-15` - Midnight UTC on June 15
- `2025-06-15T14:30` - 2:30 PM UTC on June 15
- `"2025-06-15 14:30"` - Same as above (use quotes for space)

## Provider Reference

| Provider                     | Type      | SPP1 Rate | SPP2 Rate | Daily Backpay     |
| ---------------------------- | --------- | --------- | --------- | ----------------- |
| ETH.LIMO                     | Returning | 500,000   | 700,000   | 547.95 USDC/day   |
| Namehash Labs                | Returning | 600,000   | 1,100,000 | 1,369.86 USDC/day |
| Blockful                     | Returning | 300,000   | 700,000   | 1,095.89 USDC/day |
| Unruggable                   | Returning | 400,000   | 400,000   | 0 USDC/day        |
| Ethereum Identity Foundation | Returning | 500,000   | 500,000   | 0 USDC/day        |
| Namespace                    | Returning | 200,000   | 400,000   | 547.95 USDC/day   |
| JustaName                    | New       | N/A       | 300,000   | 821.92 USDC/day   |
| ZK Email                     | New       | N/A       | 400,000   | 1,095.89 USDC/day |

## Backpay Calculation Formula

```
For returning providers:
Backpay = (SPP2 Annual Rate - SPP1 Annual Rate) / 365 × Time Elapsed

For new providers:
Backpay = SPP2 Annual Rate / 365 × Time Elapsed

Where:
- Time Elapsed = Stream Activation DateTime - May 26, 2025 11:53 PM UTC
```

## Examples

### Example 1: Date Only

If Namehash Labs' stream is activated on June 10, 2025 (midnight):

- Time period: 14 days, 0.1 hours
- Daily difference: 1,368.93 USDC
- **Total underpayment: 19,171.61 USDC**

### Example 2: Date + Time

If Namehash Labs' stream is activated on June 10, 2025 at 2:30 PM UTC:

- Time period: 14 days, 14.6 hours
- Daily difference: 1,368.93 USDC
- **Total underpayment: 19,998.67 USDC**

The extra 14.6 hours adds 827.06 USDC in additional underpayment compensation.

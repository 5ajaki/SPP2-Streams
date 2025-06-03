# SPP2 Underpayment Calculation Tools

This directory contains two tools for calculating underpayment owed to continuing providers between the SPP2 start date (May 26, 2025 11:53 PM UTC) and when their stream is activated.

## Why Underpayment?

Continuing providers are entitled to SPP2 rates starting May 26, 2025 at 11:53 PM UTC. However, their actual streams might be activated days or weeks later. These tools calculate the compensation owed for that gap period.

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

| Provider                     | SPP1 Rate | SPP2 Rate | Difference | Daily Difference   |
| ---------------------------- | --------- | --------- | ---------- | ------------------ |
| ETH.LIMO                     | 500,000   | 700,000   | +200,000   | +547.57 USDC/day   |
| Namehash Labs                | 600,000   | 1,100,000 | +500,000   | +1,368.93 USDC/day |
| Blockful                     | 300,000   | 700,000   | +400,000   | +1,095.14 USDC/day |
| Unruggable                   | 400,000   | 400,000   | No change  | 0 USDC/day         |
| Ethereum Identity Foundation | 500,000   | 500,000   | No change  | 0 USDC/day         |
| Namespace                    | 200,000   | 400,000   | +200,000   | +547.57 USDC/day   |

## Underpayment Calculation Formula

```
Underpayment = Daily Rate Difference × Time Elapsed

Where:
- Daily Rate Difference = (SPP2 Annual Rate - SPP1 Annual Rate) / 365
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

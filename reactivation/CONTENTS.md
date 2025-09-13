# Reactivation Folder Contents

This folder contains all documentation and tools related to the SPP2 stream reactivation following the August 2025 interruption.

## 📁 Files

### Documentation

- **[README.md](./README.md)** - Comprehensive documentation of the stream interruption, reactivation process, and backpay calculations
- **[CONTENTS.md](./CONTENTS.md)** - This file, describing folder contents

### Calculation Tools

- **[reactivation-backpay-calculator.js](./reactivation-backpay-calculator.js)** - Node.js script to calculate backpay for all providers
  - Usage: `node reactivation-backpay-calculator.js` (all providers)
  - Usage: `node reactivation-backpay-calculator.js <provider>` (specific provider)
- **[reactivation-backpay-web.html](./reactivation-backpay-web.html)** - Web-based calculator with visual interface
  - Open in browser for interactive backpay visualization

### Data Files

- **[backpay-data.json](./backpay-data.json)** - Machine-readable JSON with all backpay calculations and metadata
- **[safe-batch-payments.csv](./safe-batch-payments.csv)** - CSV file for Safe batch payment import

### Utilities

- **[generate-payment-batch.js](./generate-payment-batch.js)** - Script to generate Safe batch payment CSV
  - Usage: `node generate-payment-batch.js`
  - Generates/updates the safe-batch-payments.csv file

## 🔑 Key Information

- **Stream Downtime**: August 9, 2025 21:24 UTC to September 12, 2025 15:12 UTC (33.74 days)
- **Total Backpay Owed**: $416,118.37
- **Already Transferred**: $400,000 (to Management Pod)
- **Remaining to Distribute**: $16,118.37

## 📋 Quick Commands

```bash
# Calculate all backpay
node reactivation/reactivation-backpay-calculator.js

# Calculate specific provider backpay
node reactivation/reactivation-backpay-calculator.js namehash

# Generate Safe batch payment file
node reactivation/generate-payment-batch.js

# View web interface (from project root)
open reactivation/reactivation-backpay-web.html
```

## 🔗 Important Links

- [Executable Proposal Discussion](https://discuss.ens.domains/t/executable-reactivate-spp2-streams/21290)
- [Superfluid Post Mortem](https://superfluidorg.notion.site/AutoWrap-System-Failure-August-2025-24f4b6e22ae98044bad6e55f7f200e0f)
- [Stream Reactivation Transaction](https://app.safe.global/transactions/tx?safe=eth:0x91c32893216dE3eA0a55ABb9851f581d4503d39b&id=multisig_0x91c32893216dE3eA0a55ABb9851f581d4503d39b_0x5effc3728d4aee508d1205551e07d13e59ecb13169fbaca453e7c82009e21224)
- [Namehash Correction Transaction](https://app.safe.global/transactions/tx?safe=eth:0x91c32893216dE3eA0a55ABb9851f581d4503d39b&id=multisig_0x91c32893216dE3eA0a55ABb9851f581d4503d39b_0x004adb25724058c342f07283c969be8bc92f596b95ad84aebe9010a9b85799c9)

#!/usr/bin/env node

/**
 * Generate Safe batch transaction for backpay payments
 * This script creates a CSV file that can be imported into Safe for batch payments
 */

import { readFileSync } from "fs";
import { writeFileSync } from "fs";

// Load the backpay data
const backpayData = JSON.parse(
  readFileSync("./reactivation/backpay-data.json", "utf8")
);

function generateSafeBatchCSV() {
  // Safe expects CSV format: token_type, token_address, receiver, amount, id
  // For USDCx: token_type = "erc20", token_address = USDCx contract
  const USDCX_ADDRESS = "0x1BA8603DA702602A8657980e825A6DAa03Dee93a";

  let csvContent = "token_type,token_address,receiver,amount,id\n";

  backpayData.providers.forEach((provider, index) => {
    // Round to 2 decimal places for USDCx (which has 18 decimals)
    const amount = provider.totalBackpay.toFixed(2);
    const id = `SPP2-Backpay-${provider.key}`;

    csvContent += `erc20,${USDCX_ADDRESS},${provider.address},${amount},"${id}"\n`;
  });

  // Write the CSV file
  const filename = "./reactivation/safe-batch-payments.csv";
  writeFileSync(filename, csvContent);

  return { filename, totalAmount: backpayData.summary.totalBackpayOwed };
}

function generatePaymentSummary() {
  console.log("\n" + "=".repeat(80));
  console.log("SPP2 REACTIVATION - SAFE BATCH PAYMENT GENERATOR");
  console.log("=".repeat(80));

  console.log("\n📋 PAYMENT SUMMARY");
  console.log("-".repeat(40));

  let totalAmount = 0;
  backpayData.providers.forEach((provider) => {
    console.log(
      `${provider.name.padEnd(30)} $${provider.totalBackpay
        .toFixed(2)
        .padStart(12)}`
    );
    totalAmount += provider.totalBackpay;
  });

  console.log("-".repeat(40));
  console.log(`${"TOTAL".padEnd(30)} $${totalAmount.toFixed(2).padStart(12)}`);

  const result = generateSafeBatchCSV();

  console.log("\n✅ BATCH PAYMENT FILE GENERATED");
  console.log(`   File: ${result.filename}`);
  console.log(`   Total Amount: $${result.totalAmount.toFixed(2)}`);
  console.log(`   Number of Recipients: ${backpayData.providers.length}`);

  console.log("\n📌 NEXT STEPS:");
  console.log("   1. Review the generated CSV file");
  console.log(
    '   2. Import into Safe using "New Transaction" > "Batch Upload"'
  );
  console.log("   3. Verify all addresses and amounts");
  console.log("   4. Get required signatures from Safe signers");
  console.log("   5. Execute the transaction");

  console.log("\n⚠️  IMPORTANT NOTES:");
  console.log("   - Total backpay owed: $" + totalAmount.toFixed(2));
  console.log("   - Already transferred to Management Pod: $400,000.00");
  console.log(
    "   - Remaining to distribute: $" + (totalAmount - 400000).toFixed(2)
  );
  console.log(
    "   - Ensure sufficient USDC balance in Management Pod before execution"
  );

  console.log("\n" + "=".repeat(80) + "\n");
}

// Run the generator
generatePaymentSummary();

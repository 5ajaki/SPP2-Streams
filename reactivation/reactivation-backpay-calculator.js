#!/usr/bin/env node

/**
 * SPP2 Reactivation Backpay Calculator
 * Calculate backpay owed to all providers during the stream interruption period
 *
 * Stream Interruption: August 9, 2025 21:24:00 UTC to September 12, 2025 15:12:35 UTC
 * Total Downtime: 33.7421 days
 */

const PROVIDERS = {
  ethlimo: {
    name: "ETH.LIMO",
    spp2: 700000,
    address: "0x934c79f3d2797E8FBc56c8657cDBA8609b4CEFd0",
  },
  namehash: {
    name: "Namehash Labs",
    spp2: 1100000,
    address: "0x4dC96AAd2Daa3f84066F3A00EC41Fd1e88c8865A",
    note: "Rate initially set to 1,000,000 then corrected to 1,100,000",
  },
  blockful: {
    name: "Blockful",
    spp2: 700000,
    address: "0xD27e1D2b051944C5D7221E0c1335Ff088351Ce21",
  },
  unruggable: {
    name: "Unruggable",
    spp2: 400000,
    address: "0xdb4e9247b31dd87Fe67B99e8E4b39f652d734068",
  },
  "ethereum-identity": {
    name: "Ethereum Identity Foundation",
    spp2: 500000,
    address: "0x47e027531dcc326e8b487e0D7e47975bbbb5A1A5",
  },
  namespace: {
    name: "Namespace",
    spp2: 400000,
    address: "0x1679b10d4CDb02c1451F1a4cC52f9ddCDB039949",
  },
  justaname: {
    name: "JustaName",
    spp2: 300000,
    address: "0x9dC64dF5e494c50bda31b388882E5F0f607F263C",
  },
  zkemail: {
    name: "ZK Email",
    spp2: 400000,
    address: "0xdb3f226Ae171D266175dBbE09631B80331bE67CE",
  },
};

// Key dates for the reactivation
const STREAM_STOPPED = new Date("2025-08-09T21:24:00Z");
const STREAM_REACTIVATED = new Date("2025-09-12T15:12:35Z");
const NAMEHASH_CORRECTED = new Date("2025-09-12T22:02:11Z");

const DAYS_PER_YEAR = 365;
const HOURS_PER_YEAR = 8760; // 365 * 24
const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Use the standard 33.7421 days for all calculations
const STANDARD_DOWNTIME_DAYS = 33.7421;

function calculateDowntime() {
  const downtimeMs = STREAM_REACTIVATED - STREAM_STOPPED;
  const downtimeDays = downtimeMs / MS_PER_DAY;

  const days = Math.floor(downtimeDays);
  const remainingHours = (downtimeDays - days) * 24;
  const hours = Math.floor(remainingHours);
  const minutes = Math.floor((remainingHours - hours) * 60);

  return {
    totalMs: downtimeMs,
    totalDays: downtimeDays,
    display: `${days} days, ${hours} hours, ${minutes} minutes`,
    days: days,
    hours: hours,
    minutes: minutes,
  };
}

function calculateNamehashCorrection() {
  const incorrectPeriodMs = NAMEHASH_CORRECTED - STREAM_REACTIVATED;
  const incorrectPeriodDays = incorrectPeriodMs / MS_PER_DAY;

  // Difference between correct rate (1.1M) and incorrect rate (1M)
  const rateDifference = 100000; // $100k/year
  const dailyDifference = rateDifference / DAYS_PER_YEAR;
  const additionalBackpay = dailyDifference * incorrectPeriodDays;

  const hours = Math.floor(incorrectPeriodMs / (1000 * 60 * 60));
  const minutes = Math.floor(
    (incorrectPeriodMs % (1000 * 60 * 60)) / (1000 * 60)
  );

  return {
    periodDays: incorrectPeriodDays,
    display: `${hours} hours, ${minutes} minutes`,
    additionalBackpay: additionalBackpay,
  };
}

function calculateBackpay(provider) {
  // Use displayed daily rate (rounded to 2 decimals) for transparency
  const dailyRate = Math.round((provider.spp2 / DAYS_PER_YEAR) * 100) / 100;
  // Use standard 33.7421 days for consistency
  const totalBackpay = dailyRate * STANDARD_DOWNTIME_DAYS;

  return {
    provider: provider.name,
    address: provider.address,
    spp2Rate: provider.spp2,
    dailyRate: dailyRate,
    downtimeDays: STANDARD_DOWNTIME_DAYS,
    totalBackpay: totalBackpay,
    note: provider.note,
  };
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function displayResults(results, downtime, namehashCorrection) {
  console.log("\n" + "=".repeat(80));
  console.log("SPP2 STREAM REACTIVATION - BACKPAY CALCULATIONS");
  console.log("=".repeat(80));

  console.log("\n📅 TIMELINE");
  console.log("-".repeat(40));
  console.log(`Streams Stopped:      ${STREAM_STOPPED.toUTCString()}`);
  console.log(`Streams Reactivated:  ${STREAM_REACTIVATED.toUTCString()}`);
  console.log(`Total Downtime:       ${downtime.display}`);
  console.log(`Decimal Days:         ${downtime.totalDays.toFixed(4)}`);

  console.log("\n💰 BACKPAY CALCULATIONS");
  console.log("-".repeat(80));
  console.log(
    "Provider".padEnd(25) +
      "Annual Rate".padEnd(15) +
      "Daily Rate".padEnd(15) +
      "Backpay Owed".padEnd(15) +
      "Address"
  );
  console.log("-".repeat(80));

  let totalBackpay = 0;
  let namehashBackpay = 0;

  results.forEach((result) => {
    let backpayAmount = result.totalBackpay;

    // Add Namehash correction if applicable
    if (result.provider === "Namehash Labs") {
      namehashBackpay = result.totalBackpay;
      backpayAmount += namehashCorrection.additionalBackpay;
    }

    totalBackpay += backpayAmount;

    console.log(
      result.provider.padEnd(25) +
        formatCurrency(result.spp2Rate).padEnd(15) +
        formatCurrency(result.dailyRate).padEnd(15) +
        formatCurrency(backpayAmount).padEnd(15) +
        (result.address || "N/A")
    );
  });

  console.log("-".repeat(80));
  console.log(
    "TOTAL".padEnd(25) +
      formatCurrency(4500000).padEnd(15) +
      formatCurrency(4500000 / 365).padEnd(15) +
      formatCurrency(totalBackpay)
  );

  console.log("\n⚠️  NAMEHASH RATE CORRECTION");
  console.log("-".repeat(40));
  console.log(`Correction Applied:   ${NAMEHASH_CORRECTED.toUTCString()}`);
  console.log(`Period at Wrong Rate: ${namehashCorrection.display}`);
  console.log(`Rate Difference:      ${formatCurrency(100000)}/year`);
  console.log(
    `Additional Backpay:   ${formatCurrency(
      namehashCorrection.additionalBackpay
    )}`
  );
  console.log(
    `Namehash Total:       ${formatCurrency(
      namehashBackpay + namehashCorrection.additionalBackpay
    )}`
  );

  console.log("\n📊 SUMMARY");
  console.log("-".repeat(40));
  console.log(`Total Providers:      8`);
  console.log(`Total Annual Budget:  ${formatCurrency(4500000)}`);
  console.log(`Total Backpay Owed:   ${formatCurrency(totalBackpay)}`);
  console.log(
    `Retroactive Transfer: ${formatCurrency(
      400000
    )} (already sent to Management Pod)`
  );
  console.log(
    `Remaining to Distribute: ${formatCurrency(totalBackpay - 400000)}`
  );

  console.log("\n" + "=".repeat(80));
}

function displaySingleProvider(providerKey) {
  const provider = PROVIDERS[providerKey];
  if (!provider) {
    console.error(`\n❌ Error: Unknown provider '${providerKey}'`);
    console.log("\nAvailable providers:");
    Object.entries(PROVIDERS).forEach(([key, p]) => {
      console.log(`  ${key.padEnd(20)} - ${p.name}`);
    });
    process.exit(1);
  }

  const downtime = calculateDowntime();
  const result = calculateBackpay(provider);
  const namehashCorrection = calculateNamehashCorrection();

  console.log("\n" + "=".repeat(60));
  console.log(`SPP2 Reactivation Backpay for ${result.provider}`);
  console.log("=".repeat(60));
  console.log(`\n📅 Stream Interruption Period:`);
  console.log(`   From: ${STREAM_STOPPED.toUTCString()}`);
  console.log(`   To:   ${STREAM_REACTIVATED.toUTCString()}`);
  console.log(
    `   Duration: ${downtime.display} (${downtime.totalDays.toFixed(4)} days)`
  );

  console.log(`\n💰 Calculation:`);
  console.log(`   SPP2 Annual Rate:  ${formatCurrency(result.spp2Rate)}`);
  console.log(`   Daily Rate:        ${formatCurrency(result.dailyRate)}`);
  console.log(`   Downtime Days:     ${downtime.totalDays.toFixed(4)}`);

  let totalBackpay = result.totalBackpay;

  if (result.provider === "Namehash Labs") {
    console.log(`\n⚠️  Rate Correction:`);
    console.log(`   Period at $1M rate: ${namehashCorrection.display}`);
    console.log(
      `   Additional backpay: ${formatCurrency(
        namehashCorrection.additionalBackpay
      )}`
    );
    totalBackpay += namehashCorrection.additionalBackpay;
  }

  console.log(`\n✅ TOTAL BACKPAY:     ${formatCurrency(totalBackpay)}`);
  console.log(`   Wallet Address:    ${provider.address || "N/A"}`);

  if (provider.note) {
    console.log(`\n📝 Note: ${provider.note}`);
  }

  console.log("\n" + "=".repeat(60) + "\n");
}

// Command line interface
const args = process.argv.slice(2);

if (args.length === 0) {
  // Show all providers
  const downtime = calculateDowntime();
  const namehashCorrection = calculateNamehashCorrection();
  const results = Object.values(PROVIDERS).map((p) => calculateBackpay(p));
  displayResults(results, downtime, namehashCorrection);
} else {
  // Show specific provider
  const providerKey = args[0].toLowerCase();
  displaySingleProvider(providerKey);
}

// Export for potential use in other scripts
export {
  PROVIDERS,
  STREAM_STOPPED,
  STREAM_REACTIVATED,
  NAMEHASH_CORRECTED,
  calculateDowntime,
  calculateBackpay,
  calculateNamehashCorrection,
};

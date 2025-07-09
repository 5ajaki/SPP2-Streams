#!/usr/bin/env node

/**
 * SPP2 Backpay Calculator
 * Calculate backpay owed to all providers between SPP2 start and stream activation
 */

const PROVIDERS = {
  ethlimo: { name: "ETH.LIMO", spp1: 500000, spp2: 700000 },
  namehash: { name: "Namehash Labs", spp1: 600000, spp2: 1100000 },
  blockful: { name: "Blockful", spp1: 300000, spp2: 700000 },
  unruggable: { name: "Unruggable", spp1: 400000, spp2: 400000 },
  "ethereum-identity": {
    name: "Ethereum Identity Foundation",
    spp1: 500000,
    spp2: 500000,
  },
  namespace: { name: "Namespace", spp1: 200000, spp2: 400000 },
  justaname: { name: "JustaName", spp1: 0, spp2: 300000 },
  zkemail: { name: "ZK Email", spp1: 0, spp2: 400000 },
};

const SPP2_START = new Date("2025-05-26T23:53:00Z");
const DAYS_PER_YEAR = 365;
const HOURS_PER_YEAR = 8760; // 365 * 24

function formatTimePeriod(hours) {
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  let result = "";
  if (days > 0) {
    result += `${days} day${days !== 1 ? "s" : ""}`;
  }
  if (remainingHours > 0) {
    if (result) result += ", ";
    result += `${remainingHours.toFixed(1)} hour${
      remainingHours !== 1 ? "s" : ""
    }`;
  }

  return result || "0 hours";
}

function calculateUnderpayment(provider, activationDate) {
  // Calculate time elapsed in hours
  const hoursElapsed = Math.max(
    0,
    (activationDate - SPP2_START) / (1000 * 60 * 60)
  );
  const daysElapsed = hoursElapsed / 24;

  // Calculate daily rates
  const spp1Daily = provider.spp1 / DAYS_PER_YEAR;
  const spp2Daily = provider.spp2 / DAYS_PER_YEAR;
  const dailyDifference = spp2Daily - spp1Daily;

  // Calculate total underpayment
  const totalUnderpayment = Math.max(0, dailyDifference * daysElapsed);

  return {
    provider: provider.name,
    spp1Rate: provider.spp1,
    spp2Rate: provider.spp2,
    hoursElapsed: hoursElapsed,
    daysElapsed: daysElapsed.toFixed(3),
    dailyDifference: dailyDifference.toFixed(2),
    totalUnderpayment: totalUnderpayment.toFixed(2),
    hasUnderpayment: dailyDifference > 0,
  };
}

function parseDateTime(dateTimeStr) {
  // Handle various input formats:
  // "2025-06-10" - assumes midnight
  // "2025-06-10T15:30" - ISO format
  // "2025-06-10 15:30" - space separated
  // "2025-06-10T15:30:00Z" - full ISO with timezone

  if (!dateTimeStr.includes("T") && !dateTimeStr.includes(" ")) {
    // Just date, assume midnight UTC
    return new Date(dateTimeStr + "T00:00:00Z");
  } else if (dateTimeStr.includes(" ")) {
    // Space separated, convert to ISO format
    return new Date(dateTimeStr.replace(" ", "T") + ":00Z");
  } else if (!dateTimeStr.endsWith("Z")) {
    // Has time but no timezone, assume UTC
    return new Date(dateTimeStr + "Z");
  } else {
    // Already in proper format
    return new Date(dateTimeStr);
  }
}

// Command line interface
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("\nSPP2 Backpay Calculator");
  console.log("========================\n");
  console.log(
    "Calculates backpay owed between SPP2 start (May 26, 2025 11:53 PM UTC)"
  );
  console.log("and when the provider's stream is activated.\n");
  console.log(
    "Usage: node underpayment-calc.js <provider> [activation-datetime]"
  );
  console.log("\nProviders:");
  Object.entries(PROVIDERS).forEach(([key, p]) => {
    const isNew = p.spp1 === 0;
    const diff = p.spp2 - p.spp1;
    let status;
    if (isNew) {
      status = `NEW - ${p.spp2.toLocaleString()} USDC`;
    } else if (diff > 0) {
      status = `+${diff.toLocaleString()} USDC`;
    } else {
      status = "No change";
    }
    console.log(`  ${key.padEnd(20)} - ${p.name} (${status})`);
  });
  console.log("\nDate/Time formats:");
  console.log("  2025-06-15              - Midnight UTC on June 15");
  console.log("  2025-06-15T14:30        - 2:30 PM UTC on June 15");
  console.log(
    '  "2025-06-15 14:30"      - Same as above (use quotes for space)'
  );
  console.log("\nExamples:");
  console.log("  node underpayment-calc.js ethlimo 2025-06-15");
  console.log("  node underpayment-calc.js justaname 2025-06-10T15:45");
  console.log('  node underpayment-calc.js blockful "2025-06-08 09:30"\n');
  process.exit(0);
}

const providerKey = args[0].toLowerCase();
const provider = PROVIDERS[providerKey];

if (!provider) {
  console.error(`Error: Unknown provider '${args[0]}'`);
  process.exit(1);
}

let activationDate;
try {
  activationDate = args[1] ? parseDateTime(args[1]) : new Date();
} catch (e) {
  console.error(`Error: Invalid date/time format '${args[1]}'`);
  console.error("Use format like: 2025-06-15 or 2025-06-15T14:30");
  process.exit(1);
}

const result = calculateUnderpayment(provider, activationDate);

console.log("\n" + "=".repeat(60));
console.log(`SPP2 Backpay Calculation for ${result.provider}`);
console.log("=".repeat(60));
console.log(`SPP2 Start:            May 26, 2025 11:53 PM UTC`);
console.log(`Stream Activation:     ${activationDate.toUTCString()}`);
console.log(`Time Period:           ${formatTimePeriod(result.hoursElapsed)}`);

if (provider.spp1 > 0) {
  console.log(
    `SPP1 Daily Rate:       ${(result.spp1Rate / DAYS_PER_YEAR).toFixed(
      2
    )} USDC`
  );
}
console.log(
  `SPP2 Daily Rate:       ${(result.spp2Rate / DAYS_PER_YEAR).toFixed(2)} USDC`
);
console.log(`Daily Backpay Rate:    ${result.dailyDifference} USDC`);

if (result.hasUnderpayment) {
  console.log(
    `\nTOTAL BACKPAY:         ${parseFloat(
      result.totalUnderpayment
    ).toLocaleString()} USDC`
  );
} else {
  console.log(`\nNO BACKPAY - Provider rate unchanged in SPP2`);
}

console.log("=".repeat(60) + "\n");

export { calculateUnderpayment, PROVIDERS };

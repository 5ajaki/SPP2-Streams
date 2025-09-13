// Addresses from our backpay data
const addresses = {
  "ETH.LIMO": "0x934c79f3d2797E8FBc56c8657cDBA8609b4CEFd0",
  "Namehash Labs": "0x4dC96AAd2Daa3f84066F3A00EC41Fd1e88c8865A",
  "Blockful": "0xD27e1D2b051944C5D7221E0c1335Ff088351Ce21",
  "Unruggable": "0xdb4e9247b31dd87Fe67B99e8E4b39f652d734068",
  "Ethereum Identity Foundation": "0x47e027531dcc326e8b487e0D7e47975bbbb5A1A5",
  "Namespace": "0x1679b10d4CDb02c1451F1a4cC52f9ddCDB039949",
  "JustaName": "0x9dC64dF5e494c50bda31b388882E5F0f607F263C",
  "ZK Email": "0xdb3f226Ae171D266175dBbE09631B80331bE67CE"
};

// Addresses that received USDC from the Safe on Sep 3rd
const recentRecipients = [
  "0x035ebd096afa6b98372494c7f08f3402324117d3",
  "0xb9a0fb254aea7bcec79c7bd8052dcd902a5388ff",
  "0xaa7a0fff587b5b75bf8c86f838ea74786e0c4930",
  "0x719e67af46316b931fb93961a02e956b6d2dddf0",
  "0xd2cc2e47c2aecd01c87b83290c0ee76ba67a7211",
  "0xf6cc50d8dff53c10686d3beb7642aedd0600f7f7",
  "0x54becc7560a7be76d72ed76a1f5fee6c5a2a7ab6",
  "0xa21875a467b43b63af15a712c3627a70798588fc",
  "0xc02771315d0958f23a64140160e78ecb9bb8614e",
  "0x75d91395cd36f24f990bbde69993cb20b96ecfa6"
];

console.log("Checking which addresses from our data match recent USDC recipients:");
console.log("=".repeat(60));

for (const [name, addr] of Object.entries(addresses)) {
  const normalized = addr.toLowerCase();
  const found = recentRecipients.some(r => r.toLowerCase() === normalized);
  
  if (found) {
    console.log(`✓ ${name}: ${addr} - FOUND in recent transactions`);
  } else {
    console.log(`✗ ${name}: ${addr} - NOT FOUND`);
  }
}

console.log("\n" + "=".repeat(60));
console.log("Recipients not matched to our data:");
recentRecipients.forEach(addr => {
  const found = Object.values(addresses).some(a => a.toLowerCase() === addr.toLowerCase());
  if (!found) {
    console.log(`- ${addr}`);
  }
});

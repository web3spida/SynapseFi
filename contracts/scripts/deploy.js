const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying SynapseFi contracts to Polygon Amoy Testnet (PoS)...");

  // Parameters
  const initialSupply = ethers.parseEther("1000000"); // 1,000,000 tokens

  // Deploy SynapseToken
  const SynapseToken = await ethers.getContractFactory("SynapseToken");
  const synapseToken = await SynapseToken.deploy(initialSupply);
  await synapseToken.waitForDeployment();
  const synapseTokenAddress = await synapseToken.getAddress();
  console.log("SynapseToken deployed at:", synapseTokenAddress);

  // Deploy CreditPassport
  const CreditPassport = await ethers.getContractFactory("CreditPassport");
  const creditPassport = await CreditPassport.deploy();
  await creditPassport.waitForDeployment();
  const creditPassportAddress = await creditPassport.getAddress();
  console.log("CreditPassport deployed at:", creditPassportAddress);

  // Deployment Summary
  const deploymentInfo = {
    network: "polygonAmoy",
    synapseToken: {
      address: synapseTokenAddress,
      initialSupply: initialSupply.toString(),
    },
    creditPassport: {
      address: creditPassportAddress,
    },
    timestamp: new Date().toISOString()
  };

  console.log("\nDeployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Persist deployment for frontend consumption
  try {
    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir);
    const jsonPath = path.join(deploymentsDir, "latest.json");
    fs.writeFileSync(jsonPath, JSON.stringify(deploymentInfo, null, 2));

    const frontendEnvPath = path.join(__dirname, "..", "..", "frontend", ".env.local");
    const envContent = `VITE_CREDIT_PASSPORT_ADDRESS=${creditPassportAddress}\nVITE_SYNAPS_TOKEN_ADDRESS=${synapseTokenAddress}\n`;
    fs.writeFileSync(frontendEnvPath, envContent);
    console.log("\nWrote:");
    console.log("-", jsonPath);
    console.log("-", frontendEnvPath);
  } catch (e) {
    console.log("\nWarning: failed to persist deployment info:", e?.message || e);
  }

  // Verification instructions
  if (process.env.POLYGONSCAN_API_KEY) {
    console.log("\nVerification is configured (POLYGONSCAN_API_KEY found). After a few block confirmations, run:");
    console.log(
      "npx hardhat verify --network polygonAmoy",
      synapseTokenAddress,
      initialSupply.toString()
    );
    console.log("npx hardhat verify --network polygonAmoy", creditPassportAddress);
  } else {
    console.log("\nNo POLYGONSCAN_API_KEY set. Skipping verification instructions.");
  }

  console.log("\nDone.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

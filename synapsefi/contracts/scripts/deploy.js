const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying SynapseFi contracts to Polygon zkEVM Cardona Testnet...");
  
  const [deployer] = await ethers.getSigners();
  console.log("📍 Deploying contracts with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy SynapseToken
  console.log("\n📦 Deploying SynapseToken...");
  const SynapseToken = await ethers.getContractFactory("SynapseToken");
  const initialSupply = ethers.parseEther("1000000"); // 1 million tokens
  const synapseToken = await SynapseToken.deploy(initialSupply);
  await synapseToken.waitForDeployment();
  const synapseTokenAddress = await synapseToken.getAddress();
  console.log("✅ SynapseToken deployed to:", synapseTokenAddress);
  console.log("📊 Initial supply:", ethers.formatEther(initialSupply), "SYN");

  // Deploy CreditPassport
  console.log("\n📦 Deploying CreditPassport...");
  const CreditPassport = await ethers.getContractFactory("CreditPassport");
  const creditPassport = await CreditPassport.deploy();
  await creditPassport.waitForDeployment();
  const creditPassportAddress = await creditPassport.getAddress();
  console.log("✅ CreditPassport deployed to:", creditPassportAddress);

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("SynapseToken:", synapseTokenAddress);
  console.log("CreditPassport:", creditPassportAddress);
  
  // Save deployment info
  const deploymentInfo = {
    network: "polygonZkevmTestnet",
    synapseToken: {
      address: synapseTokenAddress,
      initialSupply: initialSupply.toString(),
      deployer: deployer.address,
      deploymentTx: synapseToken.deploymentTransaction().hash
    },
    creditPassport: {
      address: creditPassportAddress,
      deployer: deployer.address,
      deploymentTx: creditPassport.deploymentTransaction().hash
    },
    timestamp: new Date().toISOString()
  };
  
  console.log("\n📄 Deployment details:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  // Verify contracts if API key is available
  if (process.env.POLYGON_ZKEVM_API_KEY) {
    console.log("\n🔍 Waiting for block confirmations before verification...")
    await synapseToken.deploymentTransaction().wait(5)
    await creditPassport.deploymentTransaction().wait(5)
    console.log("\n✅ Contracts ready for verification!")
    console.log("Run: npx hardhat verify --network polygonZkevmTestnet", synapseTokenAddress, initialSupply.toString())
    console.log("Run: npx hardhat verify --network polygonZkevmTestnet", creditPassportAddress)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
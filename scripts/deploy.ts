import { ethers, upgrades } from "hardhat";

const main = async () => {
  const MedicalRecord = await ethers.getContractFactory("MedicalRecord");
  const contract = await upgrades.deployProxy(MedicalRecord);
  console.log("contract deployed to: ", contract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();

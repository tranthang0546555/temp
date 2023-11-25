import { ethers, upgrades } from "hardhat";

const main = async () => {
  const contractV1 = await ethers.getContractFactory("MedicalRecord");
  const contractV2 = await ethers.getContractFactory("MedicalRecordV2");
  await upgrades.upgradeProxy(
    "0x96Be97aCb5e029233E22A02830B0aB513812D301",
    contractV2
  );

  console.log("contract upgrade");
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

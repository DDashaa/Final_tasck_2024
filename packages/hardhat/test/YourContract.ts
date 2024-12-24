import { expect } from "chai";
import { ethers } from "hardhat";
import { YourContract } from "../typechain-types";
import { BigNumber } from "@ethersproject/bignumber";

describe("YourContract", function () {
  let yourContract: YourContract;
  let owner: any;
  let otherAccount: any; // Указываем, что это объект типа Signer

  before(async () => {
    [owner, otherAccount] = await ethers.getSigners(); // Получаем Signers
    const yourContractFactory = await ethers.getContractFactory("YourContract");
    yourContract = await yourContractFactory.deploy(owner);
    expect(await yourContract.deploymentTransaction).to.not.equal("0x0000000000000000000000000000000000000000");
  });

  describe("Deployment", function () {
    it("should set the correct owner", async function () {
      expect(await yourContract.owner()).to.equal(owner);
    });
  });

  describe("Withdraw function", function () {
    it("should allow the owner to withdraw", async function () {
      const initialBalance = await ethers.provider.getBalance(owner);
      const tx = await yourContract.withdraw();
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed;
      const finalBalance = await ethers.provider.getBalance(owner);

      const gasCost = BigNumber.from(gasUsed.toString()).mul(receipt!.gasPrice);
      const initialBalanceBN = BigNumber.from(initialBalance);
      const finalBalanceBN = BigNumber.from(finalBalance);

      expect(finalBalanceBN.sub(initialBalanceBN).abs().toNumber()).to.be.closeTo(gasCost.abs().toNumber(), 1000);
    });

    it("should not allow others to withdraw", async function () {
      await expect(yourContract.connect(otherAccount).withdraw()).to.be.revertedWith("Not the Owner");
    });
  });

  describe("Balance check", function () {
    it("should return correct balance", async function () {
      const contractBalance = await yourContract.getBalance();
      expect(contractBalance).to.equal(0); // Assuming no ether has been sent yet
    });
  });
});

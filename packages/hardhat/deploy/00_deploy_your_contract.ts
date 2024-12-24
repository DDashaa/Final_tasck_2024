import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("YourContract", {
    from: deployer,
    args: [deployer], // Передаем адрес деплойера в конструктор
    log: true,
    autoMine: true,
  });

  const yourContract = await hre.deployments.get("YourContract");
  console.log("✅ YourContract deployed at:", yourContract.address);
};

export default deployYourContract;

deployYourContract.tags = ["YourContract"];

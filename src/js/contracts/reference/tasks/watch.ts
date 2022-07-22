import {task} from "hardhat/config";
import {deployTokenController} from '../deploy/baseToken';

task("watch", "Just a generic task to run with watch", async (args, hre) => {
  const controller = await deployTokenController();

  console.log(controller.address);
});
import {deployments} from "hardhat";
import {deployBaseToken as deployBaseTokenScript} from '../../deploy/1.baseToken';
import {deployTokenController as deployTokenControllerScript} from '../../deploy/2.tokenController';

export const deployBaseToken = async () => {
  await deployments.fixture('empty');
  
  const baseTokenInstance = await deployBaseTokenScript();

  return baseTokenInstance;
}

export const deployTokenController = async () => {
  await deployments.fixture('empty');
  
  const tokenControllerInstance = await deployTokenControllerScript();

  return tokenControllerInstance;
}

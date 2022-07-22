import hre from "hardhat";
import {TokenController} from '../typechain/TokenController';
import {BaseToken} from '../typechain/BaseToken';
import {getNamedAccount} from '../helpers/accounts';
import {getEndpointAddress} from './helpers/layerZero';

const {deployments, ethers, getChainId} = hre;

// Step 1: Deploy BaseToken on L1
export const deployBaseToken = async (options = {} as any): Promise<BaseToken> => {
  const chainId = await getChainId();
  const {
    lZEndpointInstanceAddress = await getEndpointAddress(Number(chainId))
  } = options;

  await deployments.deploy('BaseToken', {
    from: await getNamedAccount('deployer'),
    log: true,
    args: [lZEndpointInstanceAddress],
    ...options
  });
  
  const baseTokenInstance = await ethers.getContract("BaseToken") as BaseToken;
  await baseTokenInstance.deployed();
  
  return baseTokenInstance;
}

const deploy = async () => {
  const baseTokenInstance = await deployBaseToken();

  return {
    baseTokenInstance
  }
};

export default deploy;
deploy.tags = ['BaseToken'];

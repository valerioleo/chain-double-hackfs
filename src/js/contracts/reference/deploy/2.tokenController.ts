import hre from "hardhat";
import {TokenController} from '../typechain/TokenController';
import {getNamedAccount} from '../helpers/accounts';
import {getEndpointAddress} from './helpers/layerZero';
import baseTokenDeployment from '../deployments/rinkeby/BaseToken.json';

const {deployments, ethers, getChainId} = hre;

// Step 2: Deploy TokenController on L2
export const deployTokenController = async (options = {} as any): Promise<TokenController> => {
  const chainId = await getChainId();
  const {
    baseTokenAddress = baseTokenDeployment.address,
    baseChainId = 10001,
    lZEndpointInstanceAddress = await getEndpointAddress(Number(chainId))
  } = options;

  const ipfsLibrary = await deployments.deploy('IPFS', {
    from: await getNamedAccount('deployer')
  });
  
  const dateLibrary = await deployments.deploy('DateLibrary', {
    from: await getNamedAccount('deployer')
  });

  await deployments.deploy('TokenController', {
    from: await getNamedAccount('deployer'),
    args: [
      lZEndpointInstanceAddress,
      baseChainId,
      baseTokenAddress,
    ],
    log: true,
    libraries: {
      IPFS: ipfsLibrary.address,
      DateLibrary: dateLibrary.address
    },
    ...options
  });

  const tokenControllerInstance = await ethers.getContract("TokenController") as TokenController;
  await tokenControllerInstance.deployed();
  
  return tokenControllerInstance;
}

const deploy = async () => {
  const baseTokenInstance = baseTokenDeployment.address;
  const tokenControllerInstance = await deployTokenController({baseTokenInstance});

  return {
    tokenControllerInstance,
    baseTokenInstance
  }
};

export default deploy;
deploy.tags = ['TokenController'];

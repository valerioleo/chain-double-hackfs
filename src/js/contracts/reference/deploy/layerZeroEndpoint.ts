import hre from "hardhat";
import {LZEndpointMock} from '../typechain/LZEndpointMock';
import {getNamedAccount} from '../helpers/accounts';

const {deployments, ethers, getChainId} = hre;

export const deployLZEndpointMock = async (options = {}): Promise<LZEndpointMock> => {
  const chainId = await getChainId();

  await deployments.deploy('LZEndpointMock', {
    from: await getNamedAccount('deployer'),
    args: [chainId],
    ...options
  });
  
  const layerZeroendpointInstance = await ethers.getContract("LZEndpointMock") as LZEndpointMock;
  await layerZeroendpointInstance.deployed();
  
  return layerZeroendpointInstance;
}

const deploy = async () => {
  const layerZeroendpointInstance = await deployLZEndpointMock();

  return {
    layerZeroendpointInstance
  }
};

export default deploy;
deploy.tags = ['LayerZeroEndpoint'];

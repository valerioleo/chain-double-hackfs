import hre from "hardhat";
import {BaseToken} from '../typechain/BaseToken';
import {getNamedAccount} from '../helpers/accounts';
import TokenControllerDeployment from '../deployments/mumbai/TokenController.json';
import {getEndpointAddress} from './helpers/layerZero';

const {deployments, ethers, getChainId} = hre;

// Step 3: Store the TokenController address on L1
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

    // we mint the first token
    (await baseTokenInstance.mint()).wait(1);
    console.log('minted first token');
    await baseTokenInstance.setTokenURI(0, 'bafkreig5gntjvwb4rusur3vehnlsbnnxebgkh3pdgob7nj2sbwhpe7bx3a');
    console.log('token URI set');
    
    await baseTokenInstance.setTrustedRemote(
      '10009',
      TokenControllerDeployment.address
    );
    console.log('trusted remote set URI set');

  return {
    baseTokenInstance
  }
};

export default deploy;
deploy.tags = ['SetupBaseToken'];

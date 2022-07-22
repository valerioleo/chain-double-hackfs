import hre, { getChainId } from "hardhat";
import {toAscii} from 'web3-utils';
import {deployBaseToken} from './1.baseToken';
// import {deployTokenController} from './tokenController';
// import TokenControllerDeployment from '../deployments/mumbai/TokenController.json';
// import BaseTokenInstance from '../deployments/rinkeby/BaseToken.json';

const {ethers} = hre;

const deploy = async () => {
  // const tokenControllerInstance = await deployTokenController();
  const baseTokenInstance = await deployBaseToken();

  // const chainId = await getChainId()
  // await baseTokenInstance.setTrustedRemote(
  //   '10009',
  //   TokenControllerDeployment.address
  // );
  // await baseTokenInstance.mint();

  // const [deployer] = await ethers.getSigners();

  // const eth = '1';
  // const tx = await deployer.sendTransaction({
  //   to: tokenControllerInstance.address,
  //   value: ethers.utils.parseEther(eth),
  // })

  // await tx.wait(0);

  // await tokenControllerInstance.setTrustedRemote(
  //   '10001',
  //   BaseTokenInstance.address
  // );

  // const estimatedFees = await tokenControllerInstance.estimateFee();
  // console.log('estimatedFees', estimatedFees.toString());

  // await tokenControllerInstance.updateTokenConfig(0, ['background', 'foreground', 'ssss'], {value: ethers.utils.parseEther('5')});
  // const meta = await tokenControllerInstance.estimateFee();
  // console.log('meta', meta.toString());

  const tokenURI = await baseTokenInstance.tokenURI(0);
  console.log(`hh tokenURI: ${tokenURI}`);

  // return {
  //   tokenControllerInstance,
  //   baseTokenInstance
  // }
};

export default deploy;
deploy.tags = ['Messaging'];

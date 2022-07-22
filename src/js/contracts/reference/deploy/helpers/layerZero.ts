import endpoints from '../../constants/layerZeroEndpoints.json';
import chainIds from '../../constants/chainIds.json';
import {deployLZEndpointMock} from '../layerZeroEndpoint';

const getKeyFromValue = (obj: any, value: any) => {
  return Object.keys(obj).find(key => obj[key] === value);
}

const toLzChainId = (chainId: number) => {
  switch (chainId) {
    case 4:
      return chainIds.rinkeby
    case 80001:
      return chainIds.mumbai

    default:
      return chainId
  }
}


export const getEndpointAddress = async (chainId: number): Promise<string> => {
  if(chainId === 1337) {
    return (await deployLZEndpointMock()).address;
  }

  const chainName = getKeyFromValue(chainIds, toLzChainId(chainId));
  if(!chainName) {
    throw new Error(`No endpoint found for chainId ${chainId}`);
  }

  const endpoint = (endpoints as any)[chainName];
  if(!endpoint) {
    throw new Error(`No endpoint found for chainId ${chainId}`);
  }

  return endpoint;
}

/* eslint-disable no-mixed-operators */
import {constant} from '../../../common/fn';
import useSmartContract from './useSmartContract';

export default () => {
  const {smartContract, callContractMethod} = useSmartContract();

  const tokenURI = ({tokenId, chainId}) => {
    callContractMethod({
      contractInterface: 'BaseToken',
      method: 'tokenURI',
      args: [tokenId],
      key: `tokenURI${tokenId}`,
      chainId
    });
  };

  const tokenURIResult = ({tokenId}) => smartContract
    .get('callContractMethodResult')
    .safeGetIn(['BaseToken', `tokenURI${tokenId}`])
    .matchWith({
      Success: ({data: contractResult}) => contractResult.matchWith({
        Call: ({data}) => {
          const {result} = data;

          return result || 'ipfs://bafybeibm4muszfvqovpxfgsa327yeu3kdn4b4y74gnsq5ofv3gnxliiaxe/10000';
        }
      }),
      Failure: err => JSON.stringify(err),
      Loading: constant(undefined),
      Empty: constant(undefined)
    });

  return {
    tokenURI,
    tokenURIResult
  };
};

/* eslint-disable no-mixed-operators */
import {toBN} from 'web3-utils';
import {constant} from '../../../common/fn';
import useSmartContract from './useSmartContract';

export default () => {
  const {smartContract, callContractMethod} = useSmartContract();

  const getUpdateTokenConfigResult = ({tokenId}) => smartContract
    .get('callContractMethodResult')
    .safeGetIn(['TokenController', `updateTokenConfig${tokenId}`]);

  const updateTokenConfig = config => {
    const {
      tokenId,
      tokenConfig,
      chainId,
      value
    } = config;

    callContractMethod({
      contractInterface: 'TokenController',
      method: 'updateTokenConfig',
      args: [tokenId, tokenConfig.slice(0, 3), tokenConfig.slice(3)],
      key: `updateTokenConfig${tokenId}`,
      chainId,
      value: toBN(value).add(toBN(1000000000000000))
    });
  };

  const estimateFee = ({chainId}) => {
    callContractMethod({
      contractInterface: 'TokenController',
      method: 'estimateFee',
      args: [],
      key: 'estimateFee',
      chainId
    });
  };

  const estimateFeeResult = () => smartContract
    .get('callContractMethodResult')
    .safeGetIn(['TokenController', 'estimateFee'])
    .matchWith({
      Success: ({data: contractResult}) => contractResult.matchWith({
        Call: ({data}) => {
          const {result} = data;

          return result;
        }
      }),
      Failure: err => {
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(err));
        return '0';
      },
      Loading: constant('0'),
      Empty: constant('0')
    });

  const generateTokenMetadata = ({tokenId, chainId}) => {
    callContractMethod({
      contractInterface: 'TokenController',
      method: 'generateTokenMetadata',
      args: [tokenId],
      key: `generateTokenMetadata${tokenId}`,
      chainId
    });
  };

  const generateTokenMetadataResult = ({tokenId}) => smartContract
    .get('callContractMethodResult')
    .safeGetIn(['TokenController', `generateTokenMetadata${tokenId}`]);

  return {
    getUpdateTokenConfigResult,
    updateTokenConfig,
    generateTokenMetadata,
    generateTokenMetadataResult,
    estimateFee,
    estimateFeeResult
  };
};

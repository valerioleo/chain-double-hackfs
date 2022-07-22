import {createAction} from 'redux-actions';
import mem from 'mem';
import {getPastEvents, executeSmartContractMethod} from '../../eth-utils/contracts';
import {TransactionResult} from '../../common/data/TransactionResult';
import {ContractResult} from '../../common/data/ContractResult';
import {getWeb3ContractInstance, replaceSpecialArgs} from '../../services/smartContract';
import {pushNotification} from '../notification/notificationsActions';
import {types as NotificationTypes} from '../../constants/notifications';

export const CALL_CONTRACT_METHOD = 'SMART_CONTRACT:CALL_CONTRACT_METHOD';
export const GET_CONTRACT_EVENTS = 'SMART_CONTRACT:GET_CONTRACT_EVENTS';
export const RESET = 'SMART_CONTRACT:RESET';
export const GET_DEFAULT_ACCOUNT = 'ACCOUNT:GET_DEFAULT_ACCOUNT';

const memoisedCallContractMethod = mem(
  async (_, context) => {
    const {
      contractInterface,
      contractAddress,
      method,
      args,
      action,
      actionDescription,
      dispatch,
      chainId,
      value
    } = context;
    const filledArgs = await replaceSpecialArgs(args);

    const contractInstance = await getWeb3ContractInstance(
      contractInterface,
      chainId,
      contractAddress
    );
    const contractResult = await executeSmartContractMethod(
      chainId,
      contractInstance,
      value,
      method,
      ...filledArgs
    );

    const result = contractResult.mapTx(txResult => {
      const updateAction = tx => {
        action(Promise.resolve({contractResult: ContractResult.Tx(tx)}));
        dispatch(
          pushNotification({
            type: NotificationTypes.TRANSACTION,
            data: tx,
            actionDescription
          })
        );
      };

      txResult
        .on('transactionHash', txHash => updateAction(TransactionResult.Signed(txHash)))
        .on('receipt', receipt => {
          updateAction(TransactionResult.Mined(receipt));
        })
        .on('confirmation', (confirmations, receipt) => updateAction(
          TransactionResult.Confirmed({confirmations, ...receipt})
        ))
        .on('error', (err, receipt) => updateAction(
          TransactionResult.Failure('error', {error: err, ...receipt})
        )); // If a out of gas error, the second parameter is the receipt.

      dispatch(
        pushNotification({
          type: NotificationTypes.TRANSACTION,
          data: TransactionResult.Unsigned(),
          actionDescription
        })
      );
      return TransactionResult.Unsigned();
    });

    return {
      contractResult: result
    };
  },
  {maxAge: 5000}
);

export const callContractMethod = ({
  contractInterface,
  method,
  args = [], // it also accepts special params using our DSL. Check fillSpecialArgs().
  key = method,
  contractAddress,
  actionDescription = '',
  eventData,
  chainId,
  value = 0
}) => dispatch => {
  const action = async => dispatch(
    createAction(CALL_CONTRACT_METHOD)({async, contractInterface, key})
  );

  return action(
    memoisedCallContractMethod(
      `${contractInterface}${contractAddress}${key}`,
      {
        contractInterface,
        contractAddress,
        method,
        args,
        action,
        actionDescription,
        eventData,
        dispatch,
        chainId,
        value
      }
    )
  );
};

export const getContractEvents = ({
  contractInterface,
  eventName = 'allEvents',
  fromBlock = 0,
  toBlock = 'latest',
  chainId
}) => {
  const runAsync = async () => {
    const contractInstance = await getWeb3ContractInstance(contractInterface, chainId);
    const logs = await getPastEvents(contractInstance, eventName, {
      fromBlock,
      toBlock
    });

    return logs;
  };

  return createAction(GET_CONTRACT_EVENTS)({
    async: runAsync(),
    eventName,
    contractInterface
  });
};

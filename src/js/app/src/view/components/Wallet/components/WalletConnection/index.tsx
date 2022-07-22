import {useEffect} from 'react';
import {injected} from '../../services/connectors';
import {addNetwork} from '../../services/network';
import useWeb3React from '../../services/hooks/useWeb3React';

// eslint-disable-next-line arrow-body-style
const toHexChainId = (chainId: number) => {
  return `0x${chainId.toString(16)}`;
};

const withWalletConnection = WrappedComponent => props => {
  const {
    useChainId,
    wantedChainId,
    setWantedChainId
  } = props;

  const {
    activate,
    chainId,
    active,
    deactivate
  } = useWeb3React();

  const handleWrongNetwork = async (): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: toHexChainId(useChainId)}]
      });
    }
    catch(switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if((switchError as any).code === 4902) {
        try {
          await addNetwork(
            toHexChainId(useChainId),
            'process.env.NETWORK_NAME',
            'process.env.RPC_URL',
            'process.env.NETWORK_NATIVE_TOKEN_NAME',
            'process.env.NETWORK_NATIVE_TOKEN_NAME',
            18,
            'process.env.EXPLORER_URL'
          );
        }
        catch(addError) {
          deactivate();
        }
      }

      // deactivate();
    }
  };

  useEffect(() => {
    if(active && wantedChainId === useChainId && chainId !== wantedChainId) {
      handleWrongNetwork();
    }
  }, [active]);

  const onConnectMetaMask = () => {
    if(active) {
      deactivate();
      // eslint-disable-next-line no-console
      console.log('deactivated');
    }

    setWantedChainId(useChainId);

    activate(injected, undefined, true)
      .catch(err => {
        if(err.message.includes('Unsupported chain id')) {
          handleWrongNetwork();
          deactivate();
        }
      });
  };

  const handleConnection = () => onConnectMetaMask();

  return (
    <>
      <WrappedComponent
        {...props}
        openPanel={() => {
          handleConnection();
        }}
      />
      {/* <WalletModal
        open={open}
        onConnectMetaMask={onConnectMetaMask}
        onClose={closePanel}
        hasMetaMask={hasMetaMask}
      /> */}
    </>
  );
};

export default withWalletConnection;

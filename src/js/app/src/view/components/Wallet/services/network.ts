/* eslint-disable no-undef */

export const addNetwork = async (
  chainId,
  chainName,
  rpcUrl,
  name,
  symbol,
  decimals,
  explorerUrl
) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (window as any).ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId,
          chainName,
          rpcUrls: [rpcUrl],
          nativeCurrency: {
            name,
            symbol,
            decimals
          },
          blockExplorerUrls: [explorerUrl]
        }
      ]
    });
  }
  catch(_) {
    // ignore
  }
};

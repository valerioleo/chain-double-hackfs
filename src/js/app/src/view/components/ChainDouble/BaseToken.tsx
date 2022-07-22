import {useEffect, useState} from 'react';
import {Box, Button} from '@mui/material';
import useBaseToken from '../../../services/hooks/connections/useBaseToken';
import useWeb3React from '../Wallet/services/hooks/useWeb3React';

const CHAIN_ID = 4;

// eslint-disable-next-line arrow-body-style
export const ChainDoubleToken = () => {
  const {account, chainId} = useWeb3React();
  const {tokenURI, tokenURIResult} = useBaseToken();

  const [imgDataURL, setImgDataURL] = useState('');

  const fetchURI = () => {
    if(account && chainId === CHAIN_ID) {
      tokenURI({tokenId: 0, chainId});
    }
  };

  useEffect(() => {
    fetchURI();
  }, [account, chainId]);

  const URI = tokenURIResult({tokenId: 0});

  useEffect(() => {
    if(URI) {
      const finalURL = URI.replace('ipfs://', 'https://ipfs.io/ipfs/');

      fetch(finalURL)
        .then(res => res.json())
        // .then(res => console.log(res))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((res: any) => {
          const imageURL = res.animation_url.replace('ipfs://', 'https://ipfs.io/ipfs/');
          fetch(imageURL)
            .then(r => r.blob())
            .then(r => URL.createObjectURL(r))
            .then(r => setImgDataURL(r));
        });
    }
  }, [URI]);

  return (
    <Box padding={3}>
      <object data={imgDataURL} style={{maxWidth: '100%'}}/>

      <Button fullWidth variant='contained' color='primary' onClick={fetchURI}>Reload Image</Button>
    </Box>
  );
};

export default ChainDoubleToken;

// /* eslint-disable max-len */
import {useState} from 'react';
import {
  Divider,
  Grid,
  Typography,
  Box
} from '@mui/material';
import {ConnectButton} from '../Wallet';
import BaseToken from './BaseToken';
import TokenController from './TokenController';

export const ChainDoubleToken = () => {
  const [wantedChainId, setWantedChainId] = useState();

  return (
    <Grid container spacing={3}>
      <Grid item xs textAlign='center'>
        <Box height={260}>
          <Typography variant='h4' fontWeight='bold'>L1</Typography>
          <Typography variant='subtitle1' fontWeight='bold'>(uses IPFS)</Typography>
          <ConnectButton text='Connect to L1' useChainId={4} wantedChainId={wantedChainId} setWantedChainId={setWantedChainId}/>

          <a href='https://rinkeby.opensea.io/assets/0xf07483E43d292a53f759E9f9f23Be18d42552ee7/0'>
            <Typography mt={20} variant='subtitle1' fontWeight='bold'>This is coming from opensea</Typography>
          </a>
        </Box>

        <BaseToken />
      </Grid>

      <Divider orientation='vertical' flexItem />

      <Grid item xs textAlign='center'>
        <Box height={100}>
          <Typography variant='h4' fontWeight='bold'>L2</Typography>
          <Typography variant='subtitle1' fontWeight='bold'>(uses on-chain data)</Typography>
          <ConnectButton text='Connect to L2' useChainId={80001} wantedChainId={wantedChainId} setWantedChainId={setWantedChainId}/>
        </Box>

        <TokenController />
      </Grid>

    </Grid>
  );
};

export default ChainDoubleToken;

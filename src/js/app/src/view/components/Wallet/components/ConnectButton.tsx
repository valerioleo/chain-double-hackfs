import {useState} from 'react';
import {
  Button,
  Typography,
  Menu,
  MenuItem,
  Grid
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {ExpandMore} from '@mui/icons-material';
import useWeb3React from '../services/hooks/useWeb3React';
import {useEagerConnect} from '../services/hooks';
import withWalletConnection from './WalletConnection';

const useStyles = makeStyles(() => ({
  walletButton: {
    cursor: 'pointer'
  },
  dropdown: {
    marginTop: 8
  },
  address: {
    fontWeight: 700
  }
}));

const CBConnectButton = props => {
  const [anchorEl, setAnchorEl] = useState(null);

  const {
    openPanel,
    useChainId
  } = props;

  useEagerConnect();

  const {
    active,
    account,
    deactivate,
    chainId
  } = useWeb3React();

  const classes = useStyles();

  const handleClose = () => setAnchorEl(null);

  const handleClick = event => setAnchorEl(event.currentTarget);

  const handleDisconnect = () => {
    deactivate();
    handleClose();
  };

  return (
    <>
      {useChainId === chainId && active && (
        <>
          <Grid
            container
            justifyItems='center'
            justifyContent='center'
            alignItems='center'
            onClick={handleClick}
            className={classes.walletButton}
          >
            <Grid item>
              <Typography
                variant='body1'
                color='textSecondary'
                className={classes.address}
                data-test-id='wallet-ui::connected-wallet-address'
              >
                {account}
              </Typography>
            </Grid>
            <Grid item>
              <ExpandMore />
            </Grid>
          </Grid>
          <Menu
            id='simple-menu'
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            className={classes.dropdown}
          >
            <MenuItem
              data-test-id='wallet-ui::disconnect-button'
              onClick={handleDisconnect}
            >
              Disconnect
            </MenuItem>
          </Menu>
        </>
      )}
      {useChainId !== chainId && (
        <Button
          onClick={openPanel}
          style={{height: 38}}
          data-test-id='wallet-ui::connect-button'
        >
          Connect
        </Button>
      )}
    </>
  );
};

export default withWalletConnection(CBConnectButton);

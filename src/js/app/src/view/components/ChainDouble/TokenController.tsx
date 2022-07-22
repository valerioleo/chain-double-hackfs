// /* eslint-disable max-len */
import {useState, useEffect, ChangeEvent} from 'react';
import {create} from 'ipfs-http-client';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  Grid
} from '@mui/material';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import useChainDouble from '../../../services/hooks/connections/useChainDouble';
import useWeb3React from '../Wallet/services/hooks/useWeb3React';

const CHAIN_ID = 80001;

const HEAD = [
  {},
  {
    x: '768',
    y: '512',
    width: '522',
    height: '1169',
    href: 'https://ipfs.io/ipfs/bafkreidinklkjqqyvpo7x5uz4qpohrpv2ba56vnuaxnscaqs4p7cyleu7u'
  },
  {
    x: '737',
    y: '497',
    width: '590',
    height: '1169',
    href: 'https://ipfs.io/ipfs/bafkreidfvixz7xnfuvucyfkxnchnnqocyw7ezv5w7nz4kimzmeexsohcaa'
  },
  {
    x: '725',
    y: '480',
    width: '590',
    height: '1169',
    href: 'https://ipfs.io/ipfs/bafkreicjopajvzjh3at5f5ohtctndont4mlgbfmxgpbry4lbfy63e2ky4m'
  }
];

const EYES = [
  {},
  {
    x: '905',
    y: '700',
    width: '590',
    height: '1169',
    href: 'https://ipfs.io/ipfs/bafkreihh4ghqvkp5erg5tjk4tcajo2zfbkyaj72eevtctvmmcdpzi3o3c4'
  },
  {
    x: '706',
    y: '670',
    width: '590',
    height: '1169',
    href: 'https://ipfs.io/ipfs/bafkreih4am3ok4jwe42htfq3xfnvcwnvczp2fihnxra6aomkgdoojxbawy'
  }
];

const client = create({url: 'https://ipfs.infura.io:5001/api/v0'});

const getSvgCode = options => {
  const {
    text,
    borderRadius,
    backgroundColor,
    eyes: eyesIndex,
    head: headIndex
  } = options;

  const eyeSettings = EYES[eyesIndex] || {};
  const headSettings = HEAD[headIndex] || {};

  return (`
    <svg width='1990' height='1990' viewBox='0 0 1990 1990' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g>
        <rect width='1990' height='1990' fill='gainsboro'/>
        <text fill='orange' xml-space='preserve' style='white-space: pre' font-family='Futura' font-size='242' letter-spacing='-0.08em'><tspan x='67' y='330'>ChainDouble</tspan></text>
        <text fill='black' xml-space='preserve' style='white-space: pre' font-family='Futura' font-size='107' letter-spacing='-0.01em'><tspan x='67' y='600'>Customise on </tspan></text>
        <text fill='black' xml-space='preserve' style='white-space: pre' font-family='Futura' font-size='107' letter-spacing='-0.01em' text-decoration='underline'><tspan x='720' y='600'>chaindouble.xyz</tspan></text>
        <rect rx="${borderRadius}" ry="${borderRadius}" x='467' y='792' width='1055' height='1055' style="fill:rgb(${backgroundColor});stroke-width:3;stroke:rgb(0,0,0)"/>

        <foreignObject x='513' y='715.25' width="900" height="850" font-size='107'>
          <p xmlns="http://www.w3.org/1999/xhtml" style='font-family: Futura'>${text}</p>
        </foreignObject>
      </g>
      <image  x="706" y="806" width="590" height="1169" href="https://ipfs.io/ipfs/bafybeidkxprhksufy53aynn2y4dnpmfsv4q4gncz4hr4k66vleflsmetdm"/>
      
      <image  x="${eyeSettings.x}" y="${eyeSettings.y}" width="${eyeSettings.width}" height="${eyeSettings.height}" href="${eyeSettings.href}"/>
      <image  x="${headSettings.x}" y="${headSettings.y}" width="${headSettings.width}" height="${headSettings.height}" href="${headSettings.href}"/>
    </svg>
  `);
};

const TokenController = () => {
  const [backgroundColor, setBackgroundColor] = useState('0');
  const [borderRadius, setBorderRadius] = useState('0');
  const [eyes, setEyes] = useState(0);
  const [head, setHead] = useState(0);
  const [text, setText] = useState('');

  const {
    account,
    chainId
  } = useWeb3React();

  const {
    getUpdateTokenConfigResult,
    updateTokenConfig,
    generateTokenMetadata,
    generateTokenMetadataResult,
    estimateFeeResult,
    estimateFee
  } = useChainDouble();

  useEffect(() => {
    if(account && chainId === CHAIN_ID) {
      generateTokenMetadata({tokenId: 0, chainId});
      estimateFee({chainId});
    }
  }, [account, chainId]);

  const tokenMetaResult = generateTokenMetadataResult({tokenId: 0});
  const updateTokenConfigResult = getUpdateTokenConfigResult({tokenId: 0});

  useEffect(() => {
    const interval = setInterval(() => {
      generateTokenMetadataResult({tokenId: 0});

      tokenMetaResult.mapPattern(
        'Success',
        null,
        ({data: contractResult}) => {
          contractResult.matchWith({
            Call: ({data}) => {
              const {result} = data;
              client.add(result)
                .then(res => {
                  // eslint-disable-next-line no-console
                  console.log(res.path);
                });
            }
          });
        }
      );
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [updateTokenConfigResult, tokenMetaResult]);

  const handleChange = setter => (event: SelectChangeEvent) => {
    setter(event.target.value as string);
  };

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const svgOptions = {
    text,
    backgroundColor,
    borderRadius,
    eyes,
    head
  };

  const tokenConfig = [
    backgroundColor,
    borderRadius,
    text,
    head,
    eyes
  ];

  const gasFees = estimateFeeResult();

  return (
    <Box padding={3}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Background Color</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={backgroundColor}
              label='Background Color'
              onChange={handleChange(setBackgroundColor)}
            >
              <MenuItem value='0'>Empty</MenuItem>
              <MenuItem value='255,0,0'>Red</MenuItem>
              <MenuItem value='0,255,0'>Green</MenuItem>
              <MenuItem value='0,0,255'>Blue</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Border Radius</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={borderRadius}
              label='Border Radius'
              onChange={handleChange(setBorderRadius)}
            >
              <MenuItem value='0'>0</MenuItem>
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='20'>20</MenuItem>
              <MenuItem value='30'>30</MenuItem>
              <MenuItem value='40'>40</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Eyes</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={String(eyes)}
              label='Eyes'
              onChange={handleChange(setEyes)}
            >
              <MenuItem value='0'>Empty</MenuItem>
              <MenuItem value='1'>Laser Stare</MenuItem>
              <MenuItem value='2'>Tough Life Glasses</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Head</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={String(head)}
              label='Head'
              onChange={handleChange(setHead)}
            >
              <MenuItem value='0'>Empty</MenuItem>
              <MenuItem value='1'>Soldier Helmet</MenuItem>
              <MenuItem value='2'>Fisherman hat</MenuItem>
              <MenuItem value='3'>Crown</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box mt={3}>
        <Box my={3}>
          <FormControl fullWidth>
            <TextField id='outlined-basic' variant='outlined' onChange={handleTextChange}/>
          </FormControl>
        </Box>
      </Box>

      <object data={`data:image/svg+xml;utf8,${getSvgCode(svgOptions)}`} style={{maxWidth: '100%'}}/>

      <Button
        variant='contained'
        fullWidth
        disabled={gasFees === '0'}
        onClick={() => {
          updateTokenConfig({
            tokenId: 0,
            chainId: CHAIN_ID,
            tokenConfig,
            value: gasFees
          });
        }}>SAVE TO L1</Button>
    </Box>
  );
};

export default TokenController;

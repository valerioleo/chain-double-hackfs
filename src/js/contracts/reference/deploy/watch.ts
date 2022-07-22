// import fs from 'fs-extra';
// import {getChainId} from 'hardhat';
// import {soliditySha3, toAscii} from 'web3-utils';
// import {deployBaseToken} from './baseToken';
// import {deployTokenController} from './tokenController';
// import {deployLZEndpointMock} from './layerZeroEndpoint';
// const { create } = require('ipfs-http-client');


// const pinataSDK = require('@pinata/sdk');
// const pinata = pinataSDK('43c613b4fe80da44155d', '176e30d263c032e6edd3f2b78e35bba77a83c249dbf3ffb6c773c55fa313428a');

// /* import the ipfs-http-client library */

// /* Create an instance of the client */
// const client = create({url: 'https://ipfs.infura.io:5001/api/v0'})

// const deploy = async () => {
//   const chainId = await getChainId();
//   // const layerZeroEndpointInstance = await deployLZEndpointMock();
//   const baseTokenInstance = await deployBaseToken();
//   const tokenControllerInstance = await deployTokenController({
//     baseTokenAddress: baseTokenInstance.address,
//     baseChainId: Number(chainId)
//   });

//   await baseTokenInstance.setTrustedRemote(
//     chainId,
//     tokenControllerInstance.address
//   );

//   await baseTokenInstance.mint()
  
//   // await tokenControllerInstance.updateTokenConfig(0, ['0,255,0', '20', 'my text'], [0, 1]);
//   const currentMetadata = await tokenControllerInstance.generateTokenMetadata(0);
//   const contractGeneratedCID = toAscii(await tokenControllerInstance.generateIPFSHashForToken(0));

//   const decodeBase64 = (str: string) => Buffer.from(str, 'base64').toString('ascii');

//   fs.outputFileSync('./test.svg', decodeBase64(JSON.parse(currentMetadata).animation_url.replace('data:image/svg+xml;base64,', '')));

//   console.log(JSON.stringify(JSON.parse(currentMetadata), null, 2));

//   fs.writeFileSync('./meta.json', currentMetadata);
//   const sourcePath = './meta.json';
//   const options = {
//       pinataMetadata: {
//           name: 'My Awesome Website',
//           keyvalues: {
//               customKey: 'customValue',
//               customKey2: 'customValue2'
//           }
//       },
//       pinataOptions: {
//           cidVersion: 0
//       }
//   };

//   const pinataResult = await pinata.pinFromFS(sourcePath, options);

//   const added = await client.add(currentMetadata)

//   console.log('PINATA CID:   ', pinataResult.IpfsHash);
//   console.log('CONTRACT CID: ', contractGeneratedCID);
//   console.log('ADDED: ', added);

//   console.log(await baseTokenInstance.tokenURI(0));

//   return {
//     tokenControllerInstance,
//     baseTokenInstance
//   }
// };

// export default deploy;
// deploy.tags = ['Watch'];

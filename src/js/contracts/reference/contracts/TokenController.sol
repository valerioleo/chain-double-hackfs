// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol";
import "./DateLibrary.sol";

import "./lzApp/NonblockingLzApp.sol";
import "./IPFS.sol";

/// @title A backend for a ChainDouble NFT
/// @author Valerio Leo @valerioHQ
contract TokenController is NonblockingLzApp {
  using Strings for uint256;
  address public baseToken;
  uint16 public baseChain;

  // tokenId => [config, config, ...]
  // first 3 traits as strings
  mapping(uint256 => string[3]) public tokenConfigs;
  mapping(uint256 => uint256[2]) public tokenConfigsSvg;
  struct UpdateRecord {
    address updater;
    uint256 timestamp;
  }

  struct SvgTrait {
    string x;
    string y;
    string width;
    string height;
    string ipfs;
    string name;
  }

  SvgTrait[] public eyes;
  SvgTrait[] public head;

  mapping(uint256 => UpdateRecord) public tokenUpdateRecords;
  string[] traitsTypes;

  constructor (address _endpoint, uint16 _baseChain, address _baseToken) NonblockingLzApp(_endpoint) {
    baseToken = _baseToken;
    baseChain = _baseChain;

    traitsTypes = ['backgroundColor', 'borderRadius', 'text', 'head', 'eyes'];

    head.push(SvgTrait({
      x: '',
      y: '',
      width: '',
      height: '',
      ipfs: '',
      name: ''
    }));
    
    head.push(SvgTrait({
      x: '768',
      y: '512',
      width: '522',
      height: '1169',
      ipfs: 'bafkreidinklkjqqyvpo7x5uz4qpohrpv2ba56vnuaxnscaqs4p7cyleu7u',
      name: 'Soldier Helmet'
    }));
    
    head.push(SvgTrait({
      x: '737',
      y: '497',
      width: '590',
      height: '1169',
      ipfs: 'bafkreidfvixz7xnfuvucyfkxnchnnqocyw7ezv5w7nz4kimzmeexsohcaa',
      name: 'Fisherman Hat'
    }));

    head.push(SvgTrait({
      x: '725',
      y: '480',
      width: '590',
      height: '1169',
      ipfs: 'bafkreicjopajvzjh3at5f5ohtctndont4mlgbfmxgpbry4lbfy63e2ky4m',
      name: 'Crown'
    }));

    eyes.push(SvgTrait({
      x: '',
      y: '',
      width: '',
      height: '',
      ipfs: '',
      name: ''
    }));

    eyes.push(SvgTrait({
      x: '905',
      y: '700',
      width: '590',
      height: '1169',
      ipfs: 'bafkreihh4ghqvkp5erg5tjk4tcajo2zfbkyaj72eevtctvmmcdpzi3o3c4',
      name: 'Laser Stare'
    }));

    eyes.push(SvgTrait({
      x: '706',
      y: '670',
      width: '590',
      height: '1169',
      ipfs: 'bafkreih4am3ok4jwe42htfq3xfnvcwnvczp2fihnxra6aomkgdoojxbawy',
      name: 'Tough Life Glasses'
    }));
  }

  function getIPFSLink(string memory _ipfsHash) public pure returns (string memory) {
    return string(abi.encodePacked('https://ipfs.io/ipfs/', _ipfsHash));
  }

  function generateTokenMetadata(uint256 tokenId) public view virtual returns(string memory) {
    string memory image = Base64.encode(bytes(generateSvg(tokenId)));
    string memory traits = getTraits(tokenId);

    return string(abi.encodePacked(
      bytes(abi.encodePacked(
        '{',
          '"name":"ChainDouble ', tokenId.toString(),'",',
          '"description":"NONAME: This is the description",',
          '"animation_url": "data:image/svg+xml;base64,',image,'",',
          '"attributes": ', traits,
        '}'
      ))
    ));
  }

  function getTraits(uint256 tokenId) private view returns (string memory) {
    bytes memory layers = abi.encodePacked('[');

    // first 3 are free text
    for(uint i = 0 ; i < 3 ; i++) {
      string memory traitType = traitsTypes[i];
      string memory traitValue = tokenConfigs[tokenId][i];

      layers = abi.encodePacked(
        layers, '{"trait_type":"',traitType,'","value":"',traitValue,'"},'
        );
    }

    // last two are svg presets
    // head
    layers = abi.encodePacked(
      layers,
      '{"trait_type":"head","value":"',head[tokenConfigsSvg[tokenId][0]].name,'"},'
    );

    // eyes
    layers = abi.encodePacked(
      layers,
      '{"trait_type":"eyes","value":"',eyes[tokenConfigsSvg[tokenId][1]].name,'"}'
    );

    layers = abi.encodePacked(layers, ']');

    return string(layers);
  }

  function updateTokenConfig(uint256 tokenId, string[3] calldata newConfigs, uint256[2] calldata svgConfigs) public payable {
    string[3] storage existingConfigs = tokenConfigs[tokenId];
    uint256[2] storage existingSvgConfigs = tokenConfigsSvg[tokenId];

    for(uint i = 0 ; i < newConfigs.length ; i++) {
      existingConfigs[i] = newConfigs[i];
    }

    existingSvgConfigs[0] = svgConfigs[0];
    existingSvgConfigs[1] = svgConfigs[1];

    tokenUpdateRecords[tokenId].updater = msg.sender;
    tokenUpdateRecords[tokenId].timestamp = block.timestamp;

    bytes memory CID = generateIPFSHashForToken(tokenId);

    _notifyToken(tokenId, CID);
  }

  function generateSvgTraits(uint256 tokenId) public view returns (string memory) {
    SvgTrait memory headSetting = head[tokenConfigsSvg[tokenId][0]]; 
    SvgTrait memory eyesSetting = eyes[tokenConfigsSvg[tokenId][1]]; 

    string memory svg = string(abi.encodePacked(
      '<image  x="', headSetting.x, '" y="', headSetting.y, '" width="', headSetting.width,'" height="',headSetting.height, '" href="', getIPFSLink(headSetting.ipfs),'"/>',
      '<image  x="', eyesSetting.x, '" y="', eyesSetting.y, '" width="', eyesSetting.width,'" height="',eyesSetting.height, '" href="', getIPFSLink(eyesSetting.ipfs),'"/>'
    ));

    return svg;
  }

  function generateSvg(uint256 tokenId) public view returns (string memory) {
    string memory backgroundColor = tokenConfigs[tokenId][0];
    string memory borderRadius = tokenConfigs[tokenId][1];
    string memory text = tokenConfigs[tokenId][2];

    // string memory updater = uint256(uint160(address(tokenUpdateRecords[tokenId].updater))).toHexString();
    // uint256 timestamp = tokenUpdateRecords[tokenId].timestamp;

    // (uint year, uint month, uint day) = DateLibrary.timestampToDate(timestamp);

    // string memory date = string(abi.encodePacked(year.toString(), "-", month.toString(), "-", day.toString()));

    string memory svg = string(abi.encodePacked(
      '<svg width="1990" height="1990" viewBox="0 0 1990 1990" fill="none" xmlns="http://www.w3.org/2000/svg">'
        '<g>'
          '<rect width="1990" height="1990" fill="gainsboro"/>'
          '<text fill="orange" xml-space="preserve" style="white-space: pre" font-family="Futura" font-size="242" letter-spacing="-0.08em"><tspan x="67" y="330">ChainDouble</tspan></text>'
          '<text fill="black" xml-space="preserve" style="white-space: pre" font-family="Futura" font-size="107" letter-spacing="-0.01em"><tspan x="67" y="600">Customise on </tspan></text>'
          '<text fill="black" xml-space="preserve" style="white-space: pre" font-family="Futura" font-size="107" letter-spacing="-0.01em" text-decoration="underline"><tspan x="720" y="600">chaindouble.xyz</tspan></text>'
          '<rect rx="', borderRadius, '" ry="', borderRadius, '" x="467" y="792" width="1055" height="1055" style="fill:rgb(', backgroundColor, ');stroke-width:3;stroke:rgb(0,0,0)"/>'

          '<foreignObject x="513" y="715.25" width="900" height="850" font-size="107">'
            '<p xmlns="http://www.w3.org/1999/xhtml" style="font-family: Futura">', text, '</p>'
          '</foreignObject>'
          
          // '<text fill="black" xml-space="preserve" style="white-space: pre" font-family="monospace" font-size="35" letter-spacing="-0.01em"><tspan x="513" y="1752.59">updated at: ', date, '</tspan><tspan x="513" y="1798.59">by: ', updater, '</tspan></text>',
        
          '<image  x="706" y="806" width="590" height="1169" href="https://ipfs.io/ipfs/bafybeidkxprhksufy53aynn2y4dnpmfsv4q4gncz4hr4k66vleflsmetdm"/>',

          generateSvgTraits(tokenId),
        '</g>'
      '</svg>'
    ));

    return svg;
  }

  function generateIPFSHashForToken(uint256 tokenId) public view returns (bytes memory) {
    string memory tokenRawMetadata = generateTokenMetadata(tokenId);

    return IPFS.generateHash(tokenRawMetadata);
  }

  function estimateFee() public view returns (uint256) {
    uint16 version = 1;
    uint gasForDestinationLzReceive = 350000;
    bytes memory adapterParams = abi.encodePacked(version, gasForDestinationLzReceive);

    bytes memory CID = bytes(string('QmPgNoTsL8DvH7fC2KShf3Hs6wbzYghZ23XLGTbvcfpmiC'));

    (uint messageFee, ) = lzEndpoint.estimateFees(baseChain, address(this), CID, false, adapterParams);

    return messageFee;
  }

  // MESSAGING
  function _notifyToken(uint256 tokenId, bytes memory payload) private {
    // use adapterParams v1 to specify more gas for the destination
    uint16 version = 1;
    uint gasForDestinationLzReceive = 350000;
    bytes memory adapterParams = abi.encodePacked(version, gasForDestinationLzReceive);
    
    // get the fees we need to pay to LayerZero for message delivery
    // (uint messageFee, ) = lzEndpoint.estimateFees(baseChain, address(this), payload, false, adapterParams);

    // send LayerZero message
    lzEndpoint.send{value: msg.value}( // {value: messageFee} will be paid out of this contract!
      baseChain, // destination chainId
      abi.encodePacked(baseToken), // destination address of PingPong contract
      abi.encodePacked(tokenId, payload), // abi.encode()'ed bytes
      payable(msg.sender), // (msg.sender will be this contract) refund address (LayerZero will refund any extra gas back to caller of send()
      address(0x0), // future param, unused for this example
      adapterParams // v1 adapterParams, specify custom destination gas qty
    );
  }

    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64, /*_nonce*/
        bytes memory _payload
    ) internal override {
        // // use assembly to extract the address from the bytes memory parameter
        // address sendBackToAddress;
        // assembly {
        //     sendBackToAddress := mload(add(_srcAddress, 20))
        // }

        // // decode the number of pings sent thus far
        // uint pings = abi.decode(_payload, (uint));

        // // *pong* back to the other sideå
        // ping(_srcChainId, sendBackToAddress, pings);
    }

    // allow this contract to receive ether
    receive() external payable {}

}

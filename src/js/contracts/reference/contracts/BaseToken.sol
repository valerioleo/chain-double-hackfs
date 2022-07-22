// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./lzApp/NonblockingLzApp.sol";

/// @title A interactive NFT controlled by a contract on L2
/// @author Valerio Leo @valerioHQ
contract BaseToken is ERC721, ERC721URIStorage, Ownable, NonblockingLzApp {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  address public tokenController;

  constructor (address _endpoint) ERC721("ChainDouble", "CNDB") NonblockingLzApp(_endpoint) {}

  function _mintNext() private {
    uint256 tokenId = _tokenIds.current();
    _tokenIds.increment();

    super._mint(msg.sender, tokenId);
  }

  function mint() public {
    _mintNext();
  }

  function setTokenController(address newTokenController) public onlyOwner {
    tokenController = newTokenController;
  }

  function setTokenURI(uint256 tokenId, string memory uri) public {
    // require(msg.sender == tokenController, 'Only the token controller can set the URI');

    ERC721URIStorage._setTokenURI(tokenId, uri);
  }

  function tokenURI(uint256 tokenId) public override(ERC721, ERC721URIStorage) view returns (string memory uri) {
    return string(abi.encodePacked('ipfs://', ERC721URIStorage.tokenURI(tokenId)));
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    ERC721URIStorage._burn(tokenId);
  }

    // MESSAGING
    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64, /*_nonce*/
        bytes memory _payload
    ) internal override {
      uint256 tokenId; // = abi.decode(calldata _payload[32:], uint256);
      assembly {tokenId := mload(add(add(_payload, 0), 32))}
      
      string memory tokenURI; // = abi.decode(calldata _payload[32:], uint256);
      for (uint256 i = 0; i < _payload.length - 32; i++) {
          tokenURI = string(abi.encodePacked(tokenURI, _payload[i + 32]));
      }


      setTokenURI(tokenId, tokenURI);
    }

    // allow this contract to receive ether
    receive() external payable {}

}

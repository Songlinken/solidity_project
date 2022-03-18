pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./RandomNumberConsumer.sol";

contract MSCollectibleVRF is ERC721Enumerable, ERC721URIStorage, RandomNumberConsumer {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    string public baseTokenURI;
    Counters.Counter private _tokenIds;
    
    uint256 public constant MAX_SUPPLY = 20;
    uint256 public constant PRICE = 0.005 ether;
    uint256 public constant MAX_PER_MINT = 4;
    mapping(address => bool) public isApprovedAddress;
    
    constructor(string memory baseURI, address _VRFCoordinator, address _LinkToken, bytes32 _keyhash)
    RandomNumberConsumer(_VRFCoordinator, _LinkToken, _keyhash)
    ERC721("NFT MSSquad", "AKLRS") {
        setBaseURI(baseURI);
        keyHash =_keyhash;
        fee = 0.1 * 10 ** 18; // 0.1 LINK
    }

    // add approved address
    function approvedAddresses(address[] calldata _address) public onlyOwner {
        for (uint256 i = 0; i < _address.length; i++) {
            isApprovedAddress[_address[i]] = true;
        }
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    // change BaseURI: only owner of contract
    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    // mint NFTs
    function mintNFTs(uint256 _count) public payable {
        // check if enough NFT left to mint
        uint256 totalMinted = _tokenIds.current();
        require(totalMinted.add(_count) <= MAX_SUPPLY, "Not enough NFTs left!");
        require(_count > 0 && _count <= MAX_PER_MINT, "Cannot mint specified number of NFTs.");
        require(msg.value >= PRICE.mul(_count), "Not enough ether to purchase NFTs.");
        // check if the address is allowed to mint
        require(isApprovedAddress[msg.sender], "Address is not allowed to mint.");

        for (uint256 i = 0; i < _count; i++) {
            RandomNumberConsumer.getRandomNumber();
            _mintSingleRandomNFT(randomResult);
        }
        // set address back to non-approved
        isApprovedAddress[msg.sender] = false;
    }

    // mint single random NFT
    function _mintSingleRandomNFT(uint256 _randomNumber) private {
        _safeMint(msg.sender, _randomNumber);
        _tokenIds.increment();
    }

    // return TokenIds for the holder
    function tokensOfOwner(address _owner) external view returns (uint[] memory) {
        uint256 tokenCount = balanceOf(_owner);
        uint256[] memory tokensId = new uint256[](tokenCount);
        
        for (uint256 i = 0; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokensId;
    }

    // withdraw balance of ether
    function withdraw() public payable onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ether left to withdraw");
        (bool success, ) = (msg.sender).call{value: balance}("");
        require(success, "Transfer failed.");
}
    
    // below are the functions override to avoid conflict from parent contracts
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override (ERC721Enumerable, ERC721) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal virtual override (ERC721URIStorage, ERC721) {
        super._burn(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view virtual override (ERC721Enumerable, ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view virtual override (ERC721URIStorage, ERC721) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
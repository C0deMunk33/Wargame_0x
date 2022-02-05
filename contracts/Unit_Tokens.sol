//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

import "./ERC1155.sol";

contract Unit_Tokens is ERC1155 {
  constructor(string memory uri_) ERC1155(uri_){

  }
  function get_unit_entropy() public view returns(bytes32){
    //every 3 hours the available units change
    return keccak256(abi.encode(block.timestamp/60/60/3));
  }
  uint256 max_unit_id = 128;


  function faucet() public {
    uint256 token_id = 1+(uint256(keccak256(abi.encode(block.timestamp, msg.sender)))%(max_unit_id-1));
    _mint(msg.sender, token_id, 1, "0x00");
  }


  function get_store_unit_id(uint256 unit_idx) public view returns(uint256){
    return (uint256(keccak256(abi.encode(unit_idx, get_unit_entropy()))))%max_unit_id;
  }

  function get_rarity(uint256 unit_id) public pure returns(uint16){
    return uint16(uint256(keccak256(abi.encode(unit_id)))%10);
  }
  bytes32 store_limit_last_entropy;
  uint256 units_purchased_during_epoch;
  uint256 epoch_unit_limit = 500;
  function buy_from_store(uint256 unit_idx) public payable {
    if(store_limit_last_entropy == get_unit_entropy()){
      require( units_purchased_during_epoch + 1 <= epoch_unit_limit, "sold out for this epoch");
      units_purchased_during_epoch ++;
    } else {
      store_limit_last_entropy = get_unit_entropy();
      units_purchased_during_epoch = 1;
    }
    require(unit_idx < 6);
    uint256 unit_id = get_store_unit_id(unit_idx);
    uint256 price = get_rarity(unit_id) * 1000000000000000000;
    require(msg.value >= price);
    _mint(msg.sender, unit_id, 1, "0x00");
  }

}

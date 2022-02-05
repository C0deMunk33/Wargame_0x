pragma solidity ^8.0.0

import "IWar_Game_Expansion";

contract Store {

  function get_ship_sale_entropy(){
    //changes every 1/2 hour
  }

  //new ship store
  function get_available_new_ship_xdai(uint8 available_ship_idx) public view returns(uint256 ship_id){
    //8 available ships per 1/2 hour, random and priced based on level and stat sum
  }
  function get_available__new_ship_credits(uint8 available_ship_idx) public view returns(uint256){}
  function get_available_new_ship_price(uint8 available_ship_idx)public view returns(uint256 price){}
  function buy_available_new_ship(uint8 available_ship_idx, uint ship_sale_entropy){}

}

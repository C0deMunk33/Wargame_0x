pragma solidity ^8.0.0

contract War_Game is IWar_Game_Expansion_Interface{
  enum Terrain_Types {
    Shallow_Water,
    Deep_Water,
    Beach,
    Desert,
    Forest,
    City,
    Wetland,
    Frozen_Tundra,
    Glaciar,
    Safe_City,
    Safe_Desert,
    Safe_Wetland,
    Safe_Forest
  }
  enum Movement_Types {
    Walk,
    Run,
    Ship,
    Stand
  }
  struct Unit {
    uint16 previous_x;
    uint16 previous_y;
    uint16 target_x;
    uint16 target_y;
    uint32 time_until_target;
    uint256 last_interaction;
    Movement_Types movement_type;
    uint16 level;
  }

/********STATS*****/

  function deterministic_int() internal pure returns(uint16){

  }

  //unit stats and weapon stats are from the bytes of the id
  function get_max_unit_speed(uint256 unit_id) public pure returns (uint16 speed){

  }

  function get_base_unit_attack(uint256 unit_id) public pure returns (uint16 ){
    
  }

  function get_unit_class(){
    //determines weapon type limitations
  }
  function get_weapon_type(){
    //
  }
  function get_weapon_damage(uint weapon_id) public view returns (uint16 damage) {
    //
  }
  function get_weapon_effective_range(uint weapon_id) public view returns(uint32 range){
    // damage falls off based on distance
  }
  function is_within_range(uint unit_id, uint weapon_id, uint target_id) returns(bool){
    //
  }
  function get_weapon_type(uint weapon_id) public view returns(){
    //
  }
  /////////////////END STATS


  mapping(uint => Unit) units;
  function start_game(uint16 spawn_point_id){
    // generate new unit
    // place at spawn point
  }

  function buy_unit(uint unit_id, uint receiver){
    // unit must be for sale
    // unit can then be placed
  }
  function place_unit(uint unit_id, uint16 x, uint16 y){
    // for new unit, can be placed near existing owned unit
  }
  function ship_unit(uint unit_id, uint16 x, uint16 y){
    // quickly moves units
    // units being shipped cannot be attacked
    // expensive to discourage use
    // must conform to terrain_type
    // movement cannot be interrupted
  }
  function teleport_unit(uint unit_id, uint16 x, uint16 y) {
    // instantly moves owned unit from 1 place to another
    // must conform to terrain_type
    //very expensive to highly discourage use
    //costs xDai
    //price is based on unit level
  }
  function move_unit(uint unit_id, uint16 x, uint16 y, uint16 speed){
    // moves unit at speed to target
    // must not be being shipped
    // target_must conform to terrain_type
    //  if in motion, current terrain_type must be appropriate
  }
  function attack(uint weapon_id, uint unit_id, uint enemy_unit_id){
    //distance calculation
    //get_weapon_damage
    //attack may stop motion
    //get defense
    //get attack rate
    //check bounty
  }
  function defend(){
    // increases damage
    // increases mining rate
    // takes x time to get into defense position
    // takes x time to come out of defense position to move, during transition, cannot attack
  }
  function get_unit_position(uint unit_id) public view returns(uint16 x, uint16 y){
    //extrapolate from unit.position_x/y -> unit.target_x based on time since unit.last_interaction

  }
  function get_terrain(uint16 x, uint16 y) public pure returns(Terrain_Types terrain_type, uint16 height){
    return ( (x+y) % 7, x+y)
  }

  function get_terrain_value(uint16 x, uint16 y) public pure returns (uint) {

  }

  function get_mined_value() public {
    // block.timestamp - time since last_checkin * terrain_value * unit mine
  }

  function add_credit_bounty() {

  }
  function add_xdai_bounty() {

  }
  function get_credit_bounty() {

  }
  function get_xdai_bounty() {

  }


  function respawn(uint token_id, uint16 spawn_point_id){
    // wait or respawn now
    // respawn now costs xDai
  }

  // admin
  function add_spawn_point(uint16 x, uint16 y) only_admin {
    // push new spawn point
    // must be safe position
  }

  function revoke_spawn_point(uint16 spawn_point_id) only_admin {

  }

  function revoke_admin() only_admin {

  }

  //expansion hooks
  function register_expansion(address expansion_address) only_admin {

  }
  function revoke_expansion(address expansion_address) only_admin {

  }
  function expansion_mint_credits() public only_admin{

  }
  function expansion_mint_unit(uint unit_id) public only_expansion {

  }
  function expansion_mint_item(uint item_id) public  only_expansion{
    //require item doesn't exist yet
  }

  // returns true if kill
  function expansion_deal_damage(uint damage) public only_expansion returns(bool){
    // if health == 0
  }
  function expansion_heal_damage(uint healing) public only_expansion {
    // check health cap
  }

  //possible expansions:
  // mining bonus
  // PvE
  // auction house
  // blind bags

}

//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

import "./IERC1155.sol";
contract War_Core_3 {

    enum Player_States {
      No_Player,
      Not_Ready,
      Ready,
      Win,
      Dead
    }
    enum Game_States {
      No_Game,
      Open,
      Playing,
      Ended,
      Draw
    }
    enum Stats {
      short_range_atk,
      long_range_atk,
      defense,
      speed,
      max_hp
    }
    enum Terrain_Types{
      player_safe,
      water,
      sand,
      low_grass,
      high_grass,
      mountain
    }

  address immutable unit_token_address;
  uint16 constant army_cost_limits = 350;
  mapping(uint256 => Game) public games;
  uint256 global_game_count;
  uint constant long_range_distance = 15;
  uint constant short_range_distance = 5;
  uint16 constant max_game_turns = 3000;

  event Game_Created(uint256 game_id);
  constructor(address unit_token) {
    unit_token_address = unit_token;
  }
  struct Unit{
    uint16 x;
    uint16 y;
    uint16 hp;
    uint256 token_id;
    uint16 last_turn;
  }

  struct Player {
    // index => unit
    mapping(uint8 => Unit) units;
    uint8 remaining_units;
    uint16 army_cost;
    Player_States player_state;
  }

  struct Game{
    mapping(address => Player) players;
    address[] player_addresses;
    uint8 player_turn;
    Game_States game_state;
    uint16 game_turn;
  }

  function get_player_units(uint256 game_id, address player, uint8 unit_idx) public view returns(
    uint16 x,
    uint16 y,
    uint16 hp,
    uint16 last_turn,
    uint256 token_id
  ){
    return (
      games[game_id].players[player].units[unit_idx].x,
      games[game_id].players[player].units[unit_idx].y,
      games[game_id].players[player].units[unit_idx].hp,
      games[game_id].players[player].units[unit_idx].last_turn,
      games[game_id].players[player].units[unit_idx].token_id
    );
  }

  function new_game() public {

    global_game_count++;
    uint256 game_id = uint128(uint256(keccak256(abi.encode(block.timestamp, global_game_count))));//scales seed
    games[game_id].player_addresses.push(msg.sender);
    games[game_id].game_state = Game_States.Open;
    games[game_id].players[msg.sender].player_state = Player_States.Not_Ready;
    emit Game_Created(game_id);
  }

  function join_game(uint256 game_id) public {
    require(games[game_id].game_state == Game_States.Open, "Game must be open");
    games[game_id].player_addresses.push(msg.sender);
    games[game_id].players[msg.sender].player_state = Player_States.Not_Ready;
  }

  function onERC1155Received(
      address ,
      address ,
      uint256 ,
      uint256 ,
      bytes calldata
  ) external pure returns (bytes4) {
    return 0xf23a6e61;
  }
  function onERC1155BatchReceived(
      address,
      address,
      uint256[] calldata,
      uint256[] calldata,
      bytes calldata
  )external pure returns (bytes4) {
    return 0xbc197c81;
  }

  function place_unit(uint256 game_id, uint8 unit_idx, uint256 unit_token_id, uint16 x, uint16 y) public {
    require(
      !is_occupied[x][y]&&games[game_id].players[msg.sender].player_state == Player_States.Not_Ready
        && (games[game_id].game_state == Game_States.Open)
        && is_valid_land(x,y,game_id), "Game must be open");

    IERC1155(unit_token_address).safeTransferFrom(msg.sender, address(this), unit_token_id, 1, "0x00");

    if(games[game_id].players[msg.sender].units[unit_idx].token_id >0) {
      remove_unit(game_id, unit_idx);
    }

    games[game_id].players[msg.sender].units[unit_idx] = Unit(x, y, get_final_stat(unit_token_id, Stats.max_hp), unit_token_id, 0);

    games[game_id].players[msg.sender].army_cost += get_unit_cost(unit_token_id);
    require(games[game_id].players[msg.sender].army_cost <= army_cost_limits, "Unit cost too high for army");
    games[game_id].players[msg.sender].remaining_units++;
    is_occupied[x][y] = true;
  }

  function leave_game(uint256 game_id) public {
    require(games[game_id].players[msg.sender].player_state == Player_States.Ready, "player must be ready");
    games[game_id].players[msg.sender].player_state = Player_States.Dead;
  }

  function ready(uint256 game_id) public {
    require(
      games[game_id].players[msg.sender].army_cost > 0
      && games[game_id].players[msg.sender].player_state == Player_States.Not_Ready, "state error"
    );
    games[game_id].players[msg.sender].player_state = Player_States.Ready;
  }

  function start_game(uint256 game_id) public {
    require( games[game_id].player_addresses.length > 1, "must be 2+ players");
    //all players must be ready
    for(uint8 player_idx = 0; player_idx < games[game_id].player_addresses.length; player_idx++){
      require(games[game_id].players[games[game_id].player_addresses[player_idx]].player_state == Player_States.Ready, "all players not ready");
    }
    games[game_id].game_turn = 1;
    games[game_id].game_state = Game_States.Playing;
    games[game_id].player_turn = uint8(uint256(keccak256(abi.encode(msg.sender, block.timestamp)))%games[game_id].player_addresses.length);
  }

  function move_unit(uint256 game_id, uint8 unit_idx, uint16 new_x, uint16 new_y) public {
    uint distance = get_distance(games[game_id].players[msg.sender].units[unit_idx].x, games[game_id].players[msg.sender].units[unit_idx].y, new_x, new_y);

    require(games[game_id].players[msg.sender].units[unit_idx].last_turn < games[game_id].game_turn
    && !is_occupied[new_x][new_y]
    && games[game_id].game_state == Game_States.Playing
    && games[game_id].player_addresses[games[game_id].player_turn] == msg.sender
    && games[game_id].players[msg.sender].player_state == Player_States.Ready
    && games[game_id].players[msg.sender].units[unit_idx].hp > 0
    && distance <= ((get_final_stat(games[game_id].players[msg.sender].units[unit_idx].token_id, Stats.speed)))
    && is_valid_land(new_x,new_y, game_id), "state error"
  );

    games[game_id].players[msg.sender].units[unit_idx].last_turn = games[game_id].game_turn;

    is_occupied[games[game_id].players[msg.sender].units[unit_idx].x][games[game_id].players[msg.sender].units[unit_idx].y] = false;
    games[game_id].players[msg.sender].units[unit_idx].x = new_x;
    games[game_id].players[msg.sender].units[unit_idx].y = new_y;
    is_occupied[new_x][new_y] = true;
  }

  function sqrt(int x) internal pure returns (int y){
       if (x == 0) return 0;
       else if (x <= 3) return 1;
       int z = (x + 1) / 2;
       y = x;
       while (z < y){
           y = z;
           z = (x / z + z) / 2;
       }
   }

  function get_distance(uint x1, uint y1, uint x2, uint y2) public pure returns(uint){
    return uint(sqrt(( (int(x1) - int(x2))**2 + (int(y1) - int(y2))**2 )));
  }


  function rand_int(uint256 seed) public pure returns(uint256){
    return uint256(keccak256(abi.encode(seed)))/10000000;
  }
  function get_tile(uint x_in, uint y_in, uint8 layer, uint256 seed) public pure returns(uint256) {

    uint x = (x_in/3)
            + (layer * seed * 999)
            + (y_in/15)%7;
    uint y = (y_in/3)
            + (layer * seed * 999)
            + (x_in/15)%7;
    return (
        (
          rand_int(x/11)
          + rand_int(x/3)
          + rand_int(x/7)
          + (((y_in/17) %3)
          * ((y_in/15) % 19))

          + rand_int(y/11)
          + rand_int(y/3)
          + rand_int(y/7)
          + (((x_in/17) %3)
          * ((x_in/15) % 19))

        )/8)/10000000000000000000000000000000000000000000000000000000000000000000;
  }


  function get_terrain_type(uint256 x, uint256 y, uint256 game_id) public pure returns(Terrain_Types){
    //todo
    uint256 tile_val = get_tile(x, y, 1, game_id);
    if(tile_val < 250){
      return Terrain_Types.water;
    } else if(tile_val < 375){
      return Terrain_Types.sand;
    } else if(tile_val < 500){
      return Terrain_Types.low_grass;
    } else if(tile_val < 550) {
      return Terrain_Types.high_grass;
    } else {
      return Terrain_Types.mountain;
    }
  }


  mapping(uint16=> mapping(uint16 => bool)) is_occupied;
  function is_valid_land(uint16 x, uint16 y, uint256 game_id) public pure returns(bool){
    Terrain_Types t = get_terrain_type(x,y, game_id);
    return (
      t == Terrain_Types.sand
      || t == Terrain_Types.low_grass
      || t == Terrain_Types.high_grass
    );
  }

  function attack(uint256 game_id, uint8 unit_idx, address target_player, uint8 target_unit_idx) public {

    require(games[game_id].game_state == Game_States.Playing
      && games[game_id].player_addresses[games[game_id].player_turn] == msg.sender
      && games[game_id].players[msg.sender].units[unit_idx].last_turn < games[game_id].game_turn, "state error");

    uint16 damage;
    uint distance = get_distance(
      games[game_id].players[msg.sender].units[unit_idx].x,
      games[game_id].players[msg.sender].units[unit_idx].y,
      games[game_id].players[target_player].units[target_unit_idx].x,
      games[game_id].players[target_player].units[target_unit_idx].y
    );
    games[game_id].players[msg.sender].units[unit_idx].last_turn = games[game_id].game_turn;

    if(distance <= short_range_distance){
      damage = get_final_stat(games[game_id].players[msg.sender].units[unit_idx].token_id, Stats.short_range_atk);
    } else if(distance <= long_range_distance){
      damage = get_final_stat(games[game_id].players[msg.sender].units[unit_idx].token_id, Stats.long_range_atk);
    }

    if(damage > get_final_stat(games[game_id].players[target_player].units[target_unit_idx].token_id, Stats.defense)){
      damage -= (get_final_stat(games[game_id].players[target_player].units[target_unit_idx].token_id, Stats.defense));
      if(games[game_id].players[target_player].units[target_unit_idx].hp > damage){
        games[game_id].players[target_player].units[target_unit_idx].hp -= (damage);
      } else {
        games[game_id].players[target_player].units[target_unit_idx].hp = 0;
        games[game_id].players[target_player].remaining_units--;


        if(games[game_id].players[target_player].remaining_units == 0){
          games[game_id].players[target_player].player_state = Player_States.Dead;

          for(uint8 player_idx =0; player_idx < games[game_id].player_addresses.length; player_idx++){
            if(games[game_id].player_addresses[player_idx] != msg.sender){
              if(games[game_id].players[games[game_id].player_addresses[player_idx]].player_state != Player_States.Dead){
                return;
              }
            }
          }
          //if we get here, all players are dead except for attacker
          games[game_id].players[msg.sender].player_state = Player_States.Win;
          games[game_id].game_state = Game_States.Ended;
          payout(game_id, msg.sender);
        }
      }
    }
  }
  function payout(uint256 game_id, address player)internal{
    //todo
  }
  function take_win(uint256 game_id) public {
    require(games[game_id].game_state == Game_States.Playing, "game not playing");
    for(uint8 player_idx =0; player_idx < games[game_id].player_addresses.length; player_idx++){
      if(games[game_id].player_addresses[player_idx] != msg.sender){
        if(games[game_id].players[games[game_id].player_addresses[player_idx]].player_state != Player_States.Dead){
          return;
        }
      }
    }

    //if we get here, all players are dead except for attacker
    games[game_id].players[msg.sender].player_state = Player_States.Win;
    games[game_id].game_state = Game_States.Ended;
    payout(game_id, msg.sender);
  }
  function remove_player(address target, uint256 game_id) public {
    //if player times out, another player can remove them
    //if it's target's turn, advance turn
    games[game_id].players[target].player_state = Player_States.Dead;
  }

  function end_turn(uint256 game_id) public {
       require( games[game_id].game_state == Game_States.Playing
         && games[game_id].player_addresses[games[game_id].player_turn] == msg.sender, "state error");

    games[game_id].game_turn ++;
    do{
        games[game_id].player_turn = uint8((games[game_id].player_turn + 1) % games[game_id].player_addresses.length);
    }while(games[game_id].players[games[game_id].player_addresses[games[game_id].player_turn]].player_state == Player_States.Dead);

    if(games[game_id].game_turn >= max_game_turns){
        games[game_id].game_state = Game_States.Draw;
    }
  }

  function remove_unit(uint256 game_id, uint8 unit_idx) public {
    if(
      games[game_id].players[msg.sender].units[unit_idx].token_id > 0
      && (games[game_id].game_state != Game_States.Playing
      || games[game_id].players[msg.sender].units[unit_idx].hp == 0) ){

        uint256 unit_id = games[game_id].players[msg.sender].units[unit_idx].token_id;
        is_occupied[games[game_id].players[msg.sender].units[unit_idx].x][games[game_id].players[msg.sender].units[unit_idx].y] = false;
        if(games[game_id].game_state == Game_States.Open){
          games[game_id].players[msg.sender].remaining_units--;
          games[game_id].players[msg.sender].army_cost -= get_unit_cost(games[game_id].players[msg.sender].units[unit_idx].token_id);
        }
        delete(games[game_id].players[msg.sender].units[unit_idx]);
        IERC1155(unit_token_address).safeTransferFrom(address(this), msg.sender, unit_id, 1, "0x00");
    }
  }

  function get_rarity(uint256 unit_id) public pure returns(uint16){
    return uint16(uint256(keccak256(abi.encode(unit_id)))%10) + 1;
  }
  function get_unit_cost(uint256 unit_id) public pure returns(uint16){
    return get_rarity(unit_id) * 10;
  }
  function get_final_stat(uint256 unit_id, Stats stat) public pure returns(uint16){
    uint16 final_stat = get_unit_stat(unit_id, stat) *  get_rarity(unit_id);
    if(stat == Stats.max_hp){
      final_stat *= 10;
    } else if(stat == Stats.speed){
      final_stat = 7+(final_stat / 100);
    } else if(stat == Stats.defense){
      final_stat = final_stat/3;
    }
    return final_stat;
  }

  function get_unit_stats(uint unit_id) public pure returns(uint16[6] memory){
    return [
      get_rarity(unit_id),
      get_final_stat(unit_id, Stats.short_range_atk),
      get_final_stat(unit_id, Stats.long_range_atk),
      get_final_stat(unit_id, Stats.defense),
      get_final_stat(unit_id, Stats.speed),
      get_final_stat(unit_id, Stats.max_hp)
    ];
  }

  function get_unit_stat(uint256 unit_id, Stats stat) public pure returns(uint16){
    return uint16(uint256(keccak256(abi.encode(unit_id, uint8(stat))))%256);
  }


  function get_player_by_index(uint256 game_id, uint8 player_idx) public view returns(uint8 remaining_units, uint16 army_cost, uint8 player_state, address player_address){
    return (
      games[game_id].players[games[game_id].player_addresses[player_idx]].remaining_units,
      games[game_id].players[games[game_id].player_addresses[player_idx]].army_cost,
      uint8(games[game_id].players[games[game_id].player_addresses[player_idx]].player_state),
      games[game_id].player_addresses[player_idx]
    );

  }
  function get_player_count(uint256 game_id) public view returns(uint8){
    return uint8(games[game_id].player_addresses.length);
  }

}

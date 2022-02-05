pragma solidity ^8.0;

contract War_Game {
  address unit_address;

  event Game_Start(int256 indexed game_id, address indexed p1, address indexed p2)
  event Game_End(int256 indexed game_id, bool in);

  uint256 global_entropy;

  enum Game_State {
    NONE_OR_ENDED,
    Queued,
    Challenge,
    Started,
    Player_1_Ready,
    Player_2_Ready,
    Player_1_Turn,
    Player_2_Turn,
    Player_1_Win,
    Player_2_Win
  }
  struct Unit{
    uint16 x;
    uint16 y;
    uint16 hp;
  }
  struct Player {
    
  }
  struct Game {
    Game_State state;
    mapping(address => Player) players;
    bool p1_winner;
    uint256 last_move;
    uint8 p1_army_cost;
    uint8 p2_army_cost;
    uint8 remaining_p1_units;
    uint8 remaining_p2_units;
  }


  queue(){
    // put up a deposit?
    uint256 game_id = get_entropy();
    games[game_id].p1 = msg.sender;
    games[game_id].state = Game_State.Queued;
    games[game_id].last_move = block.timestamp;
    emit User_Queued(address indexed player, uint256 indexed game_id);
  }
  challenge(){
    // put up a deposit? wager?
    uint256 game_id = get_entropy();
    games[game_id].p1 = msg.sender;
    games[game_id].p2 = p2;
    games[game_id].state = Game_State.Challenge;
    games[game_id].last_move = block.timestamp;
    emit Challenge_Created(address indexed p1, address indexed p2, uint256 indexed game_id);
  }
  start_game(uint256 game_id){
    require(games[game_id].last_move + 1 day > block,timestamp);
    require(games[game_id].p1 != msg.sender, "do that elsewhere");

    if(games[game_id].state == Game_State.Queued){
      games[game_id].p2 = msg.sender;
    } else if(games[game_id].state == Game_State.Challenge){
      require(games[game_id].p2 == msg.sender, "wrong p2");
    } else {
      revert("game already started or does not exist");
    }
    // game is now waiting for ready
    // coin flip to set turn order
    games[game_id] = Game_State.Started;
  }
  place_unit(uint256 game_id, uint256 unit_id, uint16 x, uint16 y) {
    //transfer unit to this contract

    require(games[game_id].p1 == msg.sender || games[game_id].p2 == msg.sender,"invalid player");
    IERC1155(unit_token_address).transferFrom(msg.sender, address(this), unit_id, 1);

    if(games[game_id].state == Game_State.Player_1_Ready){
      require(games[game_id].p1 != msg.sender, "player already ready");
    } else if(games[game_id].state == Game_State.Player_2_Ready){
      require(games[game_id].p2 != msg.sender, "player already ready");
    } else if(games[game_id].state == Game_State.Started){
    } else {
      revert("cannot place units now");
    }

    games[game_id].players[msg.sender].army_cost += get_unit_cost(unit_id);
    games[game_id].players[msg.sender].units[unit_id] ++;
    games[game_id].players[msg.sender].remaining_units ++;

  }
  remove_unit(uint8 unit_idx){
    require(games[game_id].units[unit_id] > 0, "no unit to remove");

    // user must not be ready
    if(games[game_id].state == Game_State.Player_1_Ready){
      require(games[game_id].p1 != msg.sender, "player already ready");
    } else if(games[game_id].state == Game_State.Player_2_Ready){
      require(games[game_id].p2 != msg.sender, "player already ready");
    } else if(games[game_id].state == Game_State.Started){
    } else {
      revert("cannot remove units now");
    }

    games[game_id].players[msg.sender].army_cost -= get_unit_cost(games[game_id].units[unit_idx]);
    games[game_id].players[msg.sender].units[unit_id] --;
    games[game_id].players[msg.sender].remaining_units --;
    IERC1155(unit_token_address).transferFrom(address(this), msg.sender, unit_id, 1);

  }

  get_entropy() internal returns(uint256){
    global_entropy = keccak256(abi.encode(global_entropy, msg.sender));
    return global_entropy;
  }

  ready(){
    require(games[game_id].p1 == msg.sender || games[game_id].p2 == msg.sender,"invalid player");

    if(games[game_id].state == games[game_id].state == Game_State.Started){
      if(games[game_id].p1 == msg.sender){
        games[game_id].state = Game_State.Player_1_Ready;
      } else {
        games[game_id].state = Game_State.Player_2_Ready;
      }
    } else {
      if(games[game_id].p1 == msg.sender){
        require(games[game_id].state == Player_2_Ready);
      } else {
        require(games[game_id].state == Player_1_Ready);
      }
    }

    games[game_id].last_move = block.timestamp;
    if(get_entropy()%2 == 0) {
      games[game_id].state = Player_1_Turn;
    } else{
      games[game_id].state = Player_2_Turn;
    }
  }
  move_unit(){
    require(games[game_id].p1 == msg.sender || games[game_id].p2 == msg.sender,"invalid player");

    if(games[game_id].p1 == msg.sender){
      require(games[game_id].state == Player_1_Turn);
    } else {
      require(games[game_id].state == Player_2_Turn);
    }

    // target land must be viable

    // if player no longer owns unit, unit dies
    games[game_id].remaining_units --;

    if(games[game_id].remaining_p1_units == 0){
      award();
      games[game_id].state = Player_2_Win;
    }
  }
  attack(){
    require(games[game_id].p1 == msg.sender || games[game_id].p2 == msg.sender,"invalid player");

    if(games[game_id].p1 == msg.sender){
      require(games[game_id].state == Player_1_Turn);
    } else {
      require(games[game_id].state == Player_2_Turn);
    }

    // if player no longer owns unit, unit dies
    // if targrt is no longer owned, unit dies

    // target must be in range
    //IF KILL
    games[game_id].remaining_units --;

    if(games[game_id].remaining_p1_units == 0){
      award();
      games[game_id].state = Player_2_Win;
    }
  }

  surrender(){
    require(games[game_id].p1 == msg.sender || games[game_id].p2 == msg.sender,"invalid player");
    //check gamne state

    games[game_id].state = Player_1_Win;
    games[game_id].state = Player_2_Win;
    award();
  }
}

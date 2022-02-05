const War_Core_3 = artifacts.require("War_Core_3");
const Unit_Tokens = artifacts.require("Unit_Tokens");
let Stats = [
  "rarity",
  "short_range_atk",
  "long_range_atk",
  "defense",
  "speed",
  "max_hp"
]


function x(){
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
contract("war core map",  (accounts) => {
  it("rand_int", async()=>{
    let wc3_instance = await War_Core_3.deployed()
    //console.log((await wc3_instance.rand_int("1")).toString());
    console.log((await wc3_instance.get_tile(17,2,1,1)).toString());

  })
  it("tries an attack and a move", async() => {

    let wc3_instance = await War_Core_3.deployed()
    let unit_instance = await Unit_Tokens.deployed()
    let game_rx = await wc3_instance.new_game({from:accounts[0]})
    let game_id = game_rx.logs[0].args.game_id.toString()

    await wc3_instance.join_game(game_id, {from:accounts[1]});

    let unit_0_rx = await unit_instance.faucet({from:accounts[0]})
    let unit_0_id = unit_0_rx.logs[0].args.id.toString()
    let unit_1_rx = await unit_instance.faucet({from:accounts[1]})
    let unit_1_id = unit_1_rx.logs[0].args.id.toString()

    await unit_instance.setApprovalForAll(wc3_instance.address, true, {from: accounts[0]})
    await unit_instance.setApprovalForAll(wc3_instance.address, true, {from: accounts[1]})


    do{
      rand_x = getRandomInt(1000);
      rand_y = getRandomInt(1000);
    }while(      !(await wc3_instance.is_valid_land(rand_x, rand_y, game_id))
              || !(await wc3_instance.is_valid_land(rand_x+1, rand_y+1, game_id))
              || !(await wc3_instance.is_valid_land(rand_x-1, rand_y-1, game_id))
              || !(await wc3_instance.is_valid_land(rand_x+2, rand_y+2, game_id))
            );



    await wc3_instance.place_unit(game_id, 0, unit_0_id, rand_x, rand_y, {from:accounts[0]})
    await wc3_instance.place_unit(game_id, 0, unit_1_id, rand_x+1, rand_y+1, {from:accounts[1]})


    // be ready
    await wc3_instance.ready(game_id, {from:accounts[0]})
    await wc3_instance.ready(game_id, {from:accounts[1]})
    // start game
    await wc3_instance.start_game(game_id)
    console.log("game_state")
    console.log((await wc3_instance.games(game_id)).game_state.toString())

    // attack
    let turn = await wc3_instance.games(game_id);
    console.log(turn.game_turn.toString())


    let u1 = await wc3_instance.get_player_units(game_id, accounts[0], 0)
    let u2 = await wc3_instance.get_player_units(game_id, accounts[1], 0)
    let mx1 = await wc3_instance.get_unit_stats(u1.token_id)
    let mx2 = await wc3_instance.get_unit_stats(u2.token_id)
    console.log(mx1[5].toString())
    console.log(mx2[5].toString())
    console.log(u1.hp.toString())
    console.log(u1.x.toString() + ", " + u1.y.toString())
    let stats = await wc3_instance.get_unit_stats(u1.token_id)
    for(let stat_idx = 0; stat_idx < stats.length; stat_idx++){
      console.log(Stats[stat_idx] + ": " +stats[stat_idx].toString())
    }
    console.log(u2.hp.toString())

    console.log(u2.x.toString() + ", " + u2.y.toString())
    stats = await wc3_instance.get_unit_stats(u2.token_id)
    for(let stat_idx = 0; stat_idx < stats.length; stat_idx++){
      console.log(Stats[stat_idx] + ": " +stats[stat_idx].toString())
    }
    if(turn.player_turn.toString() === "0"){
      await wc3_instance.attack(game_id, 0, accounts[1], 0, {from:accounts[0]})
      if((await wc3_instance.games(game_id)).game_state.toString() === "4"){
          console.log("game ended")
          return;
      }
      await wc3_instance.end_turn(game_id, {from:accounts[0]});
    } else {
      await wc3_instance.attack(game_id, 0, accounts[0], 0, {from:accounts[1]})
      if((await wc3_instance.games(game_id)).game_state.toString() === "4"){
          console.log("game ended")
          return;
      }
      await wc3_instance.end_turn(game_id, {from:accounts[1]});
    }
    console.log("+++++++++++++++++++++++++++++++++++++++")
    console.log((await wc3_instance.get_distance(u2.x,u2.y, parseInt(u2.x)+1, parseInt(u2.y)+1)).toString())

    turn = await wc3_instance.games(game_id);
    if(turn.player_turn.toString() === "0"){
      console.log("p0")
      await wc3_instance.move_unit(game_id, 0, u1.x-1, u1.y-1, {from:accounts[0]})
      await wc3_instance.end_turn(game_id, {from:accounts[0]});
    } else {
      console.log("p1")
      await wc3_instance.move_unit(game_id, 0,parseInt(u2.x)+1,parseInt( u2.y)+1, {from:accounts[1]})
      await wc3_instance.end_turn(game_id, {from:accounts[1]});
    }

    turn = await wc3_instance.games(game_id);
     u1 = await wc3_instance.get_player_units(game_id, accounts[0], 0)
     u2 = await wc3_instance.get_player_units(game_id, accounts[1], 0)

             console.log(u1.hp.toString())
             console.log(u2.hp.toString())

     let game_state
     do {
       game_state = await wc3_instance.games(game_id)


       if(game_state.player_turn.toString() === "0"){
         await wc3_instance.attack(game_id, 0, accounts[1], 0, {from:accounts[0]})
         if((await wc3_instance.games(game_id)).game_state.toString() === "4"){
             console.log("game ended")

             console.log((await wc3_instance.get_player_units(game_id, accounts[0], 0)).token_id.toString())
            console.log((await wc3_instance.get_player_units(game_id, accounts[1], 0)).token_id.toString())


             await wc3_instance.remove_unit(game_id, 0, {from:accounts[1]})
             await wc3_instance.remove_unit(game_id, 0, {from:accounts[0]})

           console.log((await wc3_instance.get_player_units(game_id, accounts[0], 0)).token_id.toString())
          console.log((await wc3_instance.get_player_units(game_id, accounts[1], 0)).token_id.toString())
             return;
         }
         await wc3_instance.end_turn(game_id, {from:accounts[0]});
       } else {
         await wc3_instance.attack(game_id, 0, accounts[0], 0, {from:accounts[1]})
         if((await wc3_instance.games(game_id)).game_state.toString() === "4"){
             console.log("game ended")
             console.log((await wc3_instance.get_player_units(game_id, accounts[0], 0)).token_id.toString())
            console.log((await wc3_instance.get_player_units(game_id, accounts[1], 0)).token_id.toString())


             await wc3_instance.remove_unit(game_id, 0, {from:accounts[1]})
             await wc3_instance.remove_unit(game_id, 0, {from:accounts[0]})

             console.log((await wc3_instance.get_player_units(game_id, accounts[0], 0)).token_id.toString())
            console.log((await wc3_instance.get_player_units(game_id, accounts[1], 0)).token_id.toString())
             return;
         }
         await wc3_instance.end_turn(game_id, {from:accounts[1]});
       }



     }while(game_state !== "4" && game_state !== "5")
  })





  x("show a map", async () =>{
    let wc3_instance = await War_Core_3.deployed()

    let seed =  "56"
    let offset = 1221;
    for(let row_idx = offset; row_idx < 1000 + offset; row_idx++){
      let line = ""
      for(let col_idx = offset; col_idx< 150 + offset; col_idx++){
        //
        //let tile_val = (await wc3_instance.get_tile(col_idx, row_idx, 1)).toString(10)
        //line+=tile_val + " "

        let tile_val = (await wc3_instance.get_terrain_type_X(col_idx, row_idx, seed)).toString(10)
        if(tile_val === "0"){
          line += "\x1b[44m" + " "
        } else if(tile_val === "1") {
          line += "\x1b[43m" + " "
        }else if(tile_val === "2"){
          line += "\x1b[42m" + "\x1b[32m"+" "
        }  else if(tile_val === "3"){
            line+= "\x1b[1m"+"\x1b[42m"+ " "
        } else {

            line += "\x1b[47m"+ "\x1b[37m" + " "
        }

        line+="\x1b[37m" + "\x1b[40m"+ "\x1b[0m";
      }
      console.log(line)
    }
  });



});

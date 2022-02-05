

const web3 = new Web3();

function rand_int(seed){
  let encoded_seed = web3.eth.abi.encodeParameters(["uint256"],[seed]);

  let hash = keccak256(encoded_seed)
  return (new BN(hash.toString('hex'), 16)).div(new BN("10000000", 10));
}

function bn(num){
  return new BN(num);
}
function get_tile(x_in, y_in, layer, seed){

  x_in = bn(x_in);
  y_in = bn(y_in);

  let x = x_in.div(bn(3))
    .add(bn(seed).mul(bn(layer)).mul(bn(999)))
    .add(y_in.div(bn(15)).mod(bn(7)))

  let y = y_in.div(bn(3))
    .add(bn(seed).mul(bn(layer)).mul(bn(999)))
    .add(x_in.div(bn(15)).mod(bn(7)))

  return (

         rand_int(x.div(bn(11)))
    .add(rand_int(x.div(bn(3))))
    .add(rand_int(x.div(bn(7))))
    .add(y_in.div(bn(17)).mod(bn(13))
      .mul(y_in.div(bn(15)).mod(bn(19))))

    .add(rand_int(y.div(bn(11))))
    .add(rand_int(y.div(bn(3))))
    .add(rand_int(y.div(bn(7))))
    .add(x_in.div(bn(17)).mod(bn(13))
      .mul(x_in.div(bn(15)).mod(bn(19))))


    .div(bn(8))
    .div(bn("10000000000000000000000000000000000000000000000000000000000000000000", 10))
  );

}

console.log(parseInt(get_tile(bn(17), bn(2), bn(1), bn(1)).toString(10), 10))

function get_terrain_type_X(x, y, game_id){
  let tile_val = parseInt(get_tile(x, y, 1, new BN(game_id, 10)).toString(10), 10);
  if(tile_val < 250){
    return 0;
  } else if(tile_val < 375){
    return 1;
  } else if(tile_val < 500){
    return 2;
  } else if(tile_val < 550) {
    return 3;
  } else {
    return 4;
  }
}
/*
function draw_map(){
  let seed =  "1"
  let offset = 1221;

  for(let row_idx = offset; row_idx < 100000 + offset; row_idx++){
    let line = ""
    for(let col_idx = offset; col_idx< 200 + offset; col_idx++){
      //
      //let tile_val = (await wc3_instance.get_tile(col_idx, row_idx, 1)).toString(10)
      //line+=tile_val + " "

      let tile_val = get_terrain_type_X(col_idx, row_idx, seed)

      if(tile_val === 0){
        line += "\x1b[44m" + " "
      }else if(tile_val === 1) {
        line += "\x1b[43m" + " "
      } else if(tile_val === 2){
        line += "\x1b[42m" + "\x1b[32m"+" "
      }  else if(tile_val === 3){
          line+= "\x1b[1m"+"\x1b[42m"+ " "
      } else {
          line += "\x1b[47m"+ "\x1b[37m" + " "
      }

      line+="\x1b[37m" + "\x1b[40m"+ "\x1b[0m";
    }
    console.log(line)
  }
}
*/

function test_tile(){
  console.log((get_tile(new BN(1221),new BN(1221),new BN(1),new BN(1))).toString())
}
test_tile()
//draw_map();
//test_rand_int();

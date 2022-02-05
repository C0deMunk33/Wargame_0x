


//32 x 32 px
//seperated into quadrants
//a "jewel" at 25% from top in center
// each of the 5 parts represents a stat:
// ul = short_range_atk
// ur = long_range_atk
// ll = defense
// lr = speed
// jewel = max health
//each piece has 10 levels correlating to the strength of the stat
/*
 __ __
|  *
|

*/


function get_scaled_number(num, min_num, max_num) {
  //returns 1-10 based on % from 0->max
  return Math.floor(( (num*100)/(max_num - min_num))/10 )+1
}
function load_img(src){
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// ul ur ll lr j
async function get_assembled_piece(stat_array, rarity, output_size){

  //stat_array = [
  //[stat, min, max]
  //]
  let out_canvas = document.createElement('canvas');
  out_canvas.width = output_size;
  out_canvas.height = output_size;
  let out_context  = out_canvas.getContext('2d');
  for(let stat_idx = 0; stat_idx < stat_array.length; stat_idx++){

    let scale = get_scaled_number(stat_array[stat_idx][0], stat_array[stat_idx][1], stat_array[stat_idx][2])
    //get img

    let part_img;
    switch(stat_idx){
      case 0:
        part_img = await load_img("img/pieces/" + scale + "_ul.png");
        break;
      case 1:
        part_img = await load_img("img/pieces/" + scale + "_ur.png");
        break;
      case 2:
        part_img = await load_img("img/pieces/" + scale + "_ll.png");
        break;
      case 3:
        part_img = await load_img("img/pieces/" + scale + "_lr.png");
        break;
      case 4:
        part_img = await load_img("img/pieces/" + scale + "_j.png");
        switch(rarity){
          case "10":
            part_img = await change_color(part_img, "#ffffff")
            break;
          case "2":
            part_img = await change_color(part_img, "#bfef45")
            break;
          case "3":
            part_img =await  change_color(part_img, "#3cb44b")
            break;
          case "4":
            part_img = await change_color(part_img, "#ffe119")
            break;
          case "5":
            part_img = await change_color(part_img, "#f58231")
            break;
          case "6":
            part_img = await change_color(part_img, "#e6194B")
            break;
          case "7":
            part_img = await change_color(part_img, "#42d4f4")
            break;
          case "8":
            part_img =await  change_color(part_img, "#4363d8")
            break;
          case "9":
            part_img = await change_color(part_img, "#911eb4")
            break;
          case "1":
            break;

        }
        break;
      default:
        console.log("X")
        break;
    }
    out_context.drawImage(part_img, 0,0, 32,32, 0,0, output_size, output_size)
  }

  return out_canvas;
}
function hex_to_rgb(Hex)
   {
       var Long = parseInt(Hex.replace(/^#/, ""), 16);
       return {
           R: (Long >>> 16) & 0xff,
           G: (Long >>> 8) & 0xff,
           B: Long & 0xff
       };
   }

   function addImageProcess(src) {
          return new Promise((resolve, reject) => {
              let img = new Image()
              img.onload = () => resolve(img)
              img.onerror = ()=>reject("Failed to load")
              img.src = src;
          })
      }
async function change_color(img, new_rgb){

  let new_color = hex_to_rgb(new_rgb);
  let canvas = document.createElement("canvas")
  canvas.width = img.width;
  canvas.height = img.height
  let context = canvas.getContext('2d')

  // set composite mode
  context.globalCompositeOperation = "destination-atop";
  context.fillStyle = new_rgb;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.drawImage(img, 0, 0);

  let out_img  = await addImageProcess(canvas.toDataURL())
  return out_img;
}

async function draw_assembled_piece_on_map(stat_array){
  let sprite_to_draw = await get_assembled_piece(stat_array, 64);
  let canvas = document.getElementById("main_map_canvas")
  let context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(sprite_to_draw, 0, 0);
}

wargame_abi =
[
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "unit_token",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "game_id",
        "type": "uint256"
      }
    ],
    "name": "Game_Created",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "games",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "player_turn",
        "type": "uint8"
      },
      {
        "internalType": "enum War_Core_3.Game_States",
        "name": "game_state",
        "type": "uint8"
      },
      {
        "internalType": "uint16",
        "name": "game_turn",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "game_id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "unit_idx",
        "type": "uint8"
      }
    ],
    "name": "get_player_units",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "x",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "y",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "hp",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "last_turn",
        "type": "uint16"
      },
      {
        "internalType": "uint256",
        "name": "token_id",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "new_game",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "game_id",
        "type": "uint256"
      }
    ],
    "name": "join_game",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "onERC1155Received",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "onERC1155BatchReceived",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "game_id",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "unit_idx",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "unit_token_id",
        "type": "uint256"
      },
      {
        "internalType": "uint16",
        "name": "x",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "y",
        "type": "uint16"
      }
    ],
    "name": "place_unit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "game_id",
        "type": "uint256"
      }
    ],
    "name": "leave_game",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "game_id",
        "type": "uint256"
      }
    ],
    "name": "ready",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "game_id",
        "type": "uint256"
      }
    ],
    "name": "start_game",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "game_id",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "unit_idx",
        "type": "uint8"
      },
      {
        "internalType": "uint16",
        "name": "new_x",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "new_y",
        "type": "uint16"
      }
    ],
    "name": "move_unit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "x1",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "y1",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "x2",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "y2",
        "type": "uint256"
      }
    ],
    "name": "get_distance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "seed",
        "type": "uint256"
      }
    ],
    "name": "rand_int",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "x_in",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "y_in",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "layer",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "seed",
        "type": "uint256"
      }
    ],
    "name": "get_tile",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "x",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "y",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "game_id",
        "type": "uint256"
      }
    ],
    "name": "get_terrain_type_X",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "x",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "y",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "game_id",
        "type": "uint256"
      }
    ],
    "name": "get_terrain_type",
    "outputs": [
      {
        "internalType": "enum War_Core_3.Terrain_Types",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "x",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "y",
        "type": "uint16"
      },
      {
        "internalType": "uint256",
        "name": "game_id",
        "type": "uint256"
      }
    ],
    "name": "is_valid_land",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "game_id",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "unit_idx",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "target_player",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "target_unit_idx",
        "type": "uint8"
      }
    ],
    "name": "attack",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "game_id",
        "type": "uint256"
      }
    ],
    "name": "take_win",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "target",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "game_id",
        "type": "uint256"
      }
    ],
    "name": "remove_player",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "game_id",
        "type": "uint256"
      }
    ],
    "name": "end_turn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "game_id",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "unit_idx",
        "type": "uint8"
      }
    ],
    "name": "remove_unit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "unit_id",
        "type": "uint256"
      }
    ],
    "name": "get_rarity",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "pure",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "unit_id",
        "type": "uint256"
      }
    ],
    "name": "get_unit_cost",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "pure",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "unit_id",
        "type": "uint256"
      },
      {
        "internalType": "enum War_Core_3.Stats",
        "name": "stat",
        "type": "uint8"
      }
    ],
    "name": "get_final_stat",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "pure",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "unit_id",
        "type": "uint256"
      }
    ],
    "name": "get_unit_stats",
    "outputs": [
      {
        "internalType": "uint16[6]",
        "name": "",
        "type": "uint16[6]"
      }
    ],
    "stateMutability": "pure",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "unit_id",
        "type": "uint256"
      },
      {
        "internalType": "enum War_Core_3.Stats",
        "name": "stat",
        "type": "uint8"
      }
    ],
    "name": "get_unit_stat",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "pure",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "game_id",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "player_idx",
        "type": "uint8"
      }
    ],
    "name": "get_player_by_index",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "remaining_units",
        "type": "uint8"
      },
      {
        "internalType": "uint16",
        "name": "army_cost",
        "type": "uint16"
      },
      {
        "internalType": "uint8",
        "name": "player_state",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "player_address",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "game_id",
        "type": "uint256"
      }
    ],
    "name": "get_player_count",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
]

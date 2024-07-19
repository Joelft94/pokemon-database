const axios = require('axios');
const pool = require('./db');

async function insertPokemon(pokemonNumber){
    const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`);
    

    const name = result.data.name;
    const type = result.data.types[0].type.name;
    const number = result.data.id;
    const frontImage = result.data.sprites.front_default;
    const backImage = result.data.sprites.back_default;
    const move0 = result.data.moves[0].move.name;
    let move1, move2, move3;
    if (pokemonNumber === 132) {            // ditto xD only has 1 move
        move1 = 'none';
        move2 = 'none';
        move3 = 'none';
    } else {
    move1 = result.data.moves[1].move.name;
    move2 = result.data.moves[2].move.name;
    move3 = result.data.moves[3].move.name;
    }

    console.log(name);
    console.log(type);
    console.log(number);
    console.log(move0);
    console.log(move1);
    console.log(move2);
    console.log(move3);
    console.log(frontImage);
    console.log(backImage);


    await pool.query('INSERT INTO "Pokemons" (name, type, number, move0, move1, move2, move3, front, back) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', 
                             [name, type, number, move0, move1, move2, move3, frontImage, backImage]);
    
}



for (let i = 1; i <= 151; i++) {
    insertPokemon(i);
}





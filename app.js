const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');


const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Get all trainers
app.get('/trainers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Trainers"');
        res.render('trainers', { trainers: result.rows });
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});




// Get form to add new trainer
app.get('/trainers/new', (req, res) => {
    res.render('new_trainer');
});

// Add new trainer
app.post('/trainers', async (req, res) => {
    try {
        const { name } = req.body;
        await pool.query('INSERT INTO "Trainers" (name) VALUES ($1)', [name]);
        res.redirect('/trainers');
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

// Get specific trainer by id
app.get('/trainers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM "Trainers" WHERE id = $1', [id]);
        res.render('trainer', { trainer: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

// Delete a trainer
app.post('/trainers/:id/delete', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM "Trainers" WHERE id = $1', [id]);
        res.redirect('/trainers');
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});


app.get('/pokemons', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Pokemons" ORDER BY number');
        res.render('pokemons', { pokemons: result.rows });
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});


app.get('/battles/new', async (req, res) => {
    try {
        const trainers = await pool.query('SELECT * FROM "Trainers"');
        const pokemons = await pool.query('SELECT * FROM "Pokemons" ORDER BY number');
        res.render('new_battle', { trainers: trainers.rows, pokemons: pokemons.rows });
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

app.post('/battles', async (req, res) => {
    try {
        const { trainer1_id, trainer2_id, trainer1_pokemons, trainer2_pokemons, battle_date } = req.body;

        // Ensure arrays and exactly 6 Pokémon selected
        if (!Array.isArray(trainer1_pokemons) || !Array.isArray(trainer2_pokemons) || trainer1_pokemons.length !== 6 || trainer2_pokemons.length !== 6) {
            return res.status(400).send('Each trainer must select exactly 6 Pokémon.');
        }

        // Ensure no duplicate Pokémon in either team
        const uniqueTrainer1Pokemons = new Set(trainer1_pokemons);
        const uniqueTrainer2Pokemons = new Set(trainer2_pokemons);
        if (uniqueTrainer1Pokemons.size !== 6 || uniqueTrainer2Pokemons.size !== 6) {
            return res.status(400).send('No duplicate Pokémon allowed in a team.');
        }

        // Ensure no Pokémon selected by both trainers
        const intersection = trainer1_pokemons.filter(value => trainer2_pokemons.includes(value));
        if (intersection.length > 0) {
            return res.status(400).send('Pokémon cannot be selected by both trainers.');
        }

        // Insert the battle
        const battleResult = await pool.query('INSERT INTO "Battles" (trainer1_id, trainer2_id, battle_date) VALUES ($1, $2, $3) RETURNING id', [trainer1_id, trainer2_id, battle_date]);
        const battleId = battleResult.rows[0].id;

        // Insert teams for trainer 1
        const team1Result = await pool.query('INSERT INTO "Teams" (trainer_id, battle_id) VALUES ($1, $2) RETURNING id', [trainer1_id, battleId]);
        const team1Id = team1Result.rows[0].id;
        for (let pokemonId of trainer1_pokemons) {
            await pool.query('INSERT INTO "team_pokemons" (team_id, pokemon_id) VALUES ($1, $2)', [team1Id, pokemonId]);
        }

        // Insert teams for trainer 2
        const team2Result = await pool.query('INSERT INTO "Teams" (trainer_id, battle_id) VALUES ($1, $2) RETURNING id', [trainer2_id, battleId]);
        const team2Id = team2Result.rows[0].id;
        for (let pokemonId of trainer2_pokemons) {
            await pool.query('INSERT INTO "team_pokemons" (team_id, pokemon_id) VALUES ($1, $2)', [team2Id, pokemonId]);
        }

        res.redirect('/battles');
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});


app.get('/battles', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                b.id, 
                t1.id AS trainer1_id, 
                t1.name AS trainer1_name, 
                t2.id AS trainer2_id, 
                t2.name AS trainer2_name, 
                b.battle_date, 
                b.winner_id,
                winner.name AS winner_name
            FROM "Battles" b
            JOIN "Trainers" t1 ON b.trainer1_id = t1.id
            JOIN "Trainers" t2 ON b.trainer2_id = t2.id
            LEFT JOIN "Trainers" winner ON b.winner_id = winner.id;
        `);

        res.render('battles', { battles: result.rows });
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});



app.post('/update_winner', async (req, res) => {
    try {
        const { battle_id, winner_id } = req.body;
        console.log('Form data:', req.body); // Log form data
        console.log(`Battle ID: ${battle_id}`);
        console.log(`Winner ID: ${winner_id}`);

        // Ensure winner_id is an integer
        const winnerIdInt = parseInt(winner_id, 10) || null;
        console.log(`Parsed Winner ID: ${winnerIdInt}`);
        
        // Update the database record
        await pool.query('UPDATE "Battles" SET winner_id = $1 WHERE id = $2', [winnerIdInt, battle_id]);

        res.redirect('/battles');
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});






app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

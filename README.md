# Pokémon Battle App
This is a web application to manage Pokémon battles. Trainers can select their Pokémon teams and battle against each other. The app is built using Node.js, Express, and PostgreSQL.

# Table of Contents
Features
Prerequisites
Installation
Database Setup
Running the Application
Project Structure
Routes
Technologies Used

# Features
Add and view trainers.
Add and view Pokémon.
Create and view battles between trainers.
Ensure no duplicate Pokémon within a team and no overlapping Pokémon between teams in a battle.
Update the winner of a battle.
# Prerequisites
Node.js and npm installed.
PostgreSQL installed and running.
# Installation
## Clone the repository:
git clone https://github.com/yourusername/pokemon-battle-app.git
cd pokemon-battle-app

## Install dependencies:
```
npm install
```
# Database Setup
Create a PostgreSQL database:
Use the dump file to create the necessary tables 

## Configure the database connection in db.js:
javascript
Copy code
const { Pool } = require('pg');


 ```
  const pool = new Pool({

    user: 'your-db-user',
    host: 'localhost',
    database: 'pokemon_battle_db',
    password: 'your-db-password',
    port: 5432,
    
  });
module.exports = pool;
``` 


# Running the Application

## Start the server:
```
node app.js
```
## Open your browser and go to http://localhost:3000.

# Project Structure

pokemon-battle-app/
├── app.js
├── db.js
├── views/
│   ├── battles.ejs
│   ├── new_battle.ejs
│   ├── pokemons.ejs
│   ├── trainers.ejs
│   ├── new_trainer.ejs
│   ├── trainer.ejs
├── public/
│   ├── index.html
│   ├── styles.css
│   ├── images/
│   │   ├── ... (your image files)

# Routes
## Trainers
GET /trainers: View all trainers.
GET /trainers/new: Form to add a new trainer.
POST /trainers: Add a new trainer.
GET /trainers/:id: View a specific trainer by ID.
POST /trainers/:id/delete: Delete a trainer by ID.
## Pokémons
GET /pokemons: View all Pokémon.
GET /pokemons/:id: View a specific Pokémon by number.
## Battles
GET /battles: View all battles.
GET /battles/new: Form to create a new battle.
POST /battles: Create a new battle.
POST /update_winner: Update the winner of a battle.

# Technologies Used
Node.js
Express
PostgreSQL
EJS
Tailwind CSS

# Preview
![image](https://github.com/user-attachments/assets/5b433bd6-3478-4ad5-a8f2-a5348a259f25)

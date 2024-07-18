BEGIN;

-- Create Pokemons table
CREATE TABLE IF NOT EXISTS public."Pokemons"
(
    id serial NOT NULL,
    "number" integer,
    name character varying(50) NOT NULL,
    type character varying(50) NOT NULL,
    move0 character varying(50),
    move1 character varying(50),
    move2 character varying(50),
    move3 character varying(50),
    front character varying(200),
    back character varying(200),
    PRIMARY KEY (id)
);

-- Create Trainers table
CREATE TABLE IF NOT EXISTS public."Trainers"
(
    id serial NOT NULL,
    name character varying(50) NOT NULL,
    PRIMARY KEY (id)
);

-- Create Trainer_pokemons table
CREATE TABLE IF NOT EXISTS public."Trainer_pokemons"
(
    trainer_id integer NOT NULL,
    pokemon_id integer NOT NULL,
    PRIMARY KEY (trainer_id, pokemon_id),
    FOREIGN KEY (trainer_id) REFERENCES public."Trainers" (id),
    FOREIGN KEY (pokemon_id) REFERENCES public."Pokemons" (id)
);

-- Create Battles table
CREATE TABLE IF NOT EXISTS public."Battles"
(
    id serial NOT NULL,
    trainer1_id integer,
    trainer2_id integer,
    winner_id integer,
    battle_date date,
    PRIMARY KEY (id),
    FOREIGN KEY (trainer1_id) REFERENCES public."Trainers" (id),
    FOREIGN KEY (trainer2_id) REFERENCES public."Trainers" (id),
    FOREIGN KEY (winner_id) REFERENCES public."Trainers" (id)
);

-- Create Teams table
CREATE TABLE IF NOT EXISTS public."Teams"
(
    id serial NOT NULL,
    trainer_id integer,
    battle_id integer,
    PRIMARY KEY (id),
    FOREIGN KEY (trainer_id) REFERENCES public."Trainers" (id),
    FOREIGN KEY (battle_id) REFERENCES public."Battles" (id)
);

-- Create team_pokemons table
CREATE TABLE IF NOT EXISTS public."team_pokemons"
(
    team_id integer NOT NULL,
    pokemon_id integer NOT NULL,
    PRIMARY KEY (team_id, pokemon_id),
    FOREIGN KEY (team_id) REFERENCES public."Teams" (id),
    FOREIGN KEY (pokemon_id) REFERENCES public."Pokemons" (id)
);

END;

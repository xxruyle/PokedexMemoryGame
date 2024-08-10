let getPokemon = (pokemonId) => {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId + 1}/`).then(
        (response) => {
            return response.json().then((data) => {
                return data; 
            }
            );
        }
    );
};

let getPokemonColor = (pokemonId) => {
    return fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId + 1}/`).then(
        (response) => {return response.json().then(data => {return data})}
    );
}

export {
    getPokemon,
    getPokemonColor
};
const listPokemon = document.querySelector("#pokemonList");
const buttonsHeader = document.querySelectorAll(".btn-header");
let URL = "https://pokeapi.co/api/v2/pokemon/";

let currentRequest = 0;

function fetchPokemonData(pokemonId) {
  return fetch(URL + pokemonId).then(response => response.json());
}

async function loadAndShowPokemon(pokemonId, buttonId, request) {
  try {
    const data = await fetchPokemonData(pokemonId);

    // Verificar si esta es la última solicitud realizada
    if (request === currentRequest) {
      const typesPokemons = data.types.map(type => type.type.name);

      if (buttonId === "showAll" || typesPokemons.some(type => type.includes(buttonId))) {
        showPokemon(data);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function loadAndShowPokemons(buttonId) {
  listPokemon.innerHTML = "";

  // Incrementar el contador de solicitudes
  const request = ++currentRequest;

  const promises = Array.from({ length: 150 }, (_, i) => loadAndShowPokemon(i + 1, buttonId, request));

  // Esperar a que todas las promesas se completen antes de continuar
  await Promise.all(promises);

  // Ordenar los elementos después de cargar todos los datos
  const pokemons = Array.from(listPokemon.children);
  pokemons.sort((a, b) => {
    const idA = parseInt(a.querySelector(".pokemonIdBack").textContent.slice(1));
    const idB = parseInt(b.querySelector(".pokemonIdBack").textContent.slice(1));
    return idA - idB;
  });
  listPokemon.innerHTML = "";
  pokemons.forEach(pokemon => listPokemon.appendChild(pokemon));
}

// Nueva función para cargar todos los Pokémon al inicio
async function init() {
  await loadAndShowPokemons("showAll");
}

// Llama a la función init al cargar la página
init();

buttonsHeader.forEach(button => button.addEventListener("click", (event) => {
  const buttonId = event.currentTarget.id;
  loadAndShowPokemons(buttonId);
}));


function showPokemon(poke){

    let types = poke.types.map((type) => `
        <p class="${type.type.name} type">${type.type.name}</p>
    `);
    types = types.join("");

    let pokeId = poke.id.toString();
    if(pokeId.length === 1){
        pokeId = "00" + pokeId;
    }else if(pokeId.length === 2){
        pokeId = "0" + pokeId;
    };

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemonIdBack">#${pokeId}</p>
        <div class="pokemonImage">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemonInfo">
            <div class="nameContainer">
                <p class="pokemonId">#${pokeId}</p>
                <h2 class="pokemonName">${poke.name}</h2>
            </div>
            <div class="pokemonType">
                ${types}
            </div>
            <div class="pokemonStats">
                <p class="pokemonStat">${poke.height}M</p>
                <p class="pokemonStat">${poke.weight}KG</p>
            </div>
        </div>
    `
    listPokemon.append(div);
};

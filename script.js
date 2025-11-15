window.onload = async (event) => {
  await createCards();
};

function handleSelectChange(event) {
  const select = event.target;
  const selectedValue = select.value;
  return selectedValue;
}

async function createCards() {
  const pokemonsContainer = document.getElementById("pokemonsId");
  pokemonsContainer.innerHTML = "";

  const select = document.getElementById("type");
  select.addEventListener("change", handleSelectChange);

  const detailedPokemons = await currentPokemonList(select);

  let pageTotal = Math.ceil(detailedPokemons.length / elementsByPage);

  detailedPokemons.forEach((currentPokemon, index) => {
    const div = document.createElement("div");
    const image = document.createElement("img");
    const name = document.createElement("h2");

    div.className = "pokemon-card";
    div.title = currentPokemon.name;
    div.id = currentPokemon.name;
    image.src = currentPokemon?.sprites?.front_default || "";
    name.textContent = currentPokemon?.name;

    div.appendChild(image);
    div.appendChild(name);
    pokemonsContainer.appendChild(div);
  });

  const pagesContainer = document.getElementById("pages");
  pagesContainer.innerHTML = "";

  for (let i = 1; i <= pageTotal; i++) {
    const option = document.createElement("option");

    option.value = i;
    option.textContent = i;

    pagesContainer.appendChild(option);
  }

  elementsShownInPage();
}

function onChangeSelectPage() {
  const selectPage = document.getElementById("pages");
  selectPage.addEventListener("change", handleSelectChange);

  elementsShownInPage(selectPage.value);
}

function nextPage() {
  let currentPage = document.getElementById("pages");
  const nextPageValue =
    currentPage.options.length === parseInt(currentPage.value)
      ? parseInt(currentPage.value)
      : parseInt(currentPage.value) + 1;

  currentPage.value = String(nextPageValue);

  currentPage.dispatchEvent(new Event("change", { bubbles: true }));

  elementsShownInPage(nextPageValue);
}

function previousPage() {
  let currentPage = document.getElementById("pages");
  const nextPageValue =
    1 === parseInt(currentPage.value)
      ? parseInt(currentPage.value)
      : parseInt(currentPage.value) - 1;

  currentPage.value = String(nextPageValue);

  currentPage.dispatchEvent(new Event("change", { bubbles: true }));

  elementsShownInPage(nextPageValue);
}

async function fetchPokemon(name) {
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

  const data = await response.json();

  return data;
}

async function fetchPokemonByType(selectType) {
  let type = selectType?.value;

  let response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);

  const data = await response.json();

  const pokemonsArray = data.pokemon;

  return pokemonsArray;
}

const elementsByPage = 8;

function elementsShownInPage(page = 1) {
  const startIndex = (page - 1) * elementsByPage;
  const endIndex = startIndex + elementsByPage;

  const pokemonContainer = document.getElementById("pokemonsId");
  const cards = Array.from(pokemonContainer.querySelectorAll(".pokemon-card"));

  cards.forEach((card, index) => {
    if (index >= startIndex && index < endIndex) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

async function currentPokemonList(currentSelect) {
  const pokemonList = await fetchPokemonByType(currentSelect);

  const fetches = pokemonList.map((entry) => fetchPokemon(entry.pokemon.name));

  const detailedPokemons = await Promise.all(fetches);

  return detailedPokemons;
}

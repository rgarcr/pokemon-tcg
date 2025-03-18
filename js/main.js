// To do
//********************************************************************************************************** */ 
//create function to hide section input for search options
//create function/functions to hide loader, notifySearch lbl and animations, hide no results lbl
//organize code


fillSets(); //fill sets
document.querySelector(".section-input").style.visibility = "hidden"; //hide search options while fetch is called to get options for sets

document.querySelector('.btn-search').addEventListener('click', getCards)

//event listener for btn to scroll up
document.querySelector(".btn-scroll-up").addEventListener("click", (e) => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

//show or hide scroll button
window.addEventListener("scroll", scrollFunction);


async function getCards() {
  const btnSearch = document.querySelector(".btn-search");
  const searchLbl = document.querySelector(".notify-searching");
  const noResultsLbl = document.querySelector(".notify-no-search");
  const resultsContainer = document.querySelector(".cards-results");
  const pokeball = document.querySelector(".poke-ball");

  btnSearch.classList.toggle("disabled"); //disable btn when searching
  searchLbl.style.visibility = "visible"; //show searching lbl and animation
  pokeball.classList.toggle("none");//show animation pokeball 

  const url = buildURL(); //get url
  const data = await getCardData(url); //get sata from url

  await delayLoader(2000); // delay for 2 second

  searchLbl.style.visibility = "hidden"; //hide searching animation after results come in
  pokeball.classList.toggle("none")//hide animation pokeball 

  // clear previous results
  if (resultsContainer.childElementCount > 0)
    resultsContainer.innerHTML = '';

  // display no results if no cards are found, enable button, and end function
  if (!data || data.count == 0) {
    noResultsLbl.style.display = "block";
    btnSearch.classList.toggle("disabled");
    return;
  }

  noResultsLbl.style.display = "none"; //hide no results
  data.data.forEach(card => createCard(resultsContainer, card));
  btnSearch.classList.toggle("disabled"); //enable btn-search
}

// fetch data and return data
async function getCardData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) 
      throw new Error(`Response status: ${response.status}`);
    
    return await response.json();
  } catch (error) {
    //if theres an error send a default response 
    console.error('Failed to fetch card data', error.message);
    return { count: 0, data: [] };
  }
}


// function to build url from user  input
function buildURL() {
  const searchName = document.querySelector('#search-name').value.trim().toLocaleLowerCase(); //change choice to search
  const setOption = document.querySelector('#set-select').value; //change option to set
  const orderbyOp = document.querySelector('#order-cards-by').value; //change orderbyOp to orderBy

  //search with q
  //ex: https://api.pokemontcg.io/v2/cards?q=name:pikachu

  //build url to search by user input
  let url = `https://api.pokemontcg.io/v2/cards?`;
  let queryArr = [];

  //if value in setOp add to query
  if (setOption) queryArr.push(`set.id:${setOption}`);
  //if value in name add to query
  if (searchName) queryArr.push(`name:${searchName}`);
  //add to url if array has set or name
  if (queryArr.length > 0) url += `q=${queryArr.join(" ")}`;

  //if value in orderBy add to query
  if (orderbyOp) url += `&orderBy=${orderbyOp}`;

  console.log(url);
  return url;
}


// create a container and add properties from card, not all cards have the same properties
function createCard(container, card) {
  console.log(card)
  let cardContainer = document.createElement("section");
  let list = document.createElement("ul");
  let h2Name = document.createElement("h2");
  let pkmSet = document.createElement("h3");
  let pkmSeries = document.createElement("h4");
  let pkmImg = document.createElement("img");
  let pkmTypes = document.createElement("li");
  let attack1 = document.createElement("li");
  let attack2 = document.createElement("li");
  let pkmRarity = document.createElement("li");
  let pkmAvgPrice = document.createElement("li");

  h2Name.innerHTML = card.name;
  pkmSeries.innerHTML = "Series: " + card.set.series;
  pkmSet.innerHTML = "Set: " + card.set.name;
  pkmImg.src = card.images.small;
  pkmTypes.innerHTML = "Type: " + (card.types ? card.types : (card.supertype ? card.supertype : 'N/A'));

  attack1.innerHTML = 'Attack1: ' + (card.attacks?.[0]?.name || "N/A");
  attack2.innerHTML = 'Attack2: ' + (card.attacks?.[1]?.name || "N/A");

  pkmRarity.innerHTML = "Rarity: " + (card.rarity || "N/A");

  pkmAvgPrice.innerHTML = "AVG SellPrice: $" +
    (card.cardmarket ? Number(card.cardmarket.prices.averageSellPrice).toFixed(2) : "N/A");

  list.append(pkmTypes, attack1, attack2, pkmRarity, pkmAvgPrice);
  cardContainer.append(h2Name, pkmSet, pkmSeries, pkmImg, list);
  container.append(cardContainer);

}

//function to fill select options sets
async function fillSets() {
  try {
    const res = await fetch("https://api.pokemontcg.io/v2/sets?&orderBy=series");
    const data = await res.json(); // parse response as JSON

    console.log(data)
    let select = document.querySelector("#set-select");
    data.data.forEach(set => {
      let option = document.createElement("option");
      option.value = set.id;
      option.innerHTML = set.name;
      select.appendChild(option);
    });
    // show section-input when data from api fills selects in options
    await delayLoader("1000");
    document.querySelector(".section-input").style.visibility = "visible";
    // hider loader
    document.querySelector(".search__loader").style.display = "none";


  }
  catch (error) {
    console.error('Failed to fetch card data', error.message);
  }

}


function searchBySeries() {
  //&orderBy=-set.releaseDate"
  //search by series Scarlet & Violet 
  //"https://api.pokemontcg.io/v2/cards?q=set.series:Scarlet & Violet"
  fetch("https://api.pokemontcg.io/v2/cards?q=set.series:Scarlet & Violet&orderBy=set.releaseDate")
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)
    })
    .catch(err => {
      console.log(`error ${err}`)
    });
}


function getCardsBySet(setID) {
  fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${setID}&orderBy=set.releaseDate`)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)
    })
    .catch(err => {
      console.log(`error ${err}`)
    });
}

//display or hide button when window scrolls
// When the user scrolls down 100px from the top, show the button
function scrollFunction() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    document.querySelector(".btn-scroll-up").style.display = "block";
  } else {
    document.querySelector(".btn-scroll-up").style.display = "none";
  }
}

// function to delay loader
function delayLoader(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



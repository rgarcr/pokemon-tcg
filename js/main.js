
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
  const searchLblDots = document.querySelectorAll(".notify-searching__dot");
  const noResultsLbl = document.querySelector(".notify-no-search");
  const resultsContainer = document.querySelector(".cards-results");

  btnSearch.classList.toggle("disabled"); //disable btn when searching
  searchLbl.style.visibility = "visible"; //show searching lbl and animation
  searchLblDots.forEach(node =>
    node.classList.toggle("none"));
  noResultsLbl.style.visibility = "hidden"; //hide no results lbl

  const url = buildURL(); //get url
  const data = await getCardData(url); //get sata from url

  searchLbl.style.visibility = "hidden"; //hide searching animation after results come in
  searchLblDots.forEach(node =>
    node.classList.toggle("none"));

  // display no results if no cards are found, enable button, and end function
  if (!data || data.count == 0) {
    noResultsLbl.style.visibility = "visible";
    btnSearch.classList.toggle("disabled");
    return;
  }

  noResultsLbl.style.visibility = "hidden"; //hide no results

  // clear previous results
  if (resultsContainer.childElementCount > 0) 
    resultsContainer.innerHTML = '';

  data.data.forEach(card => createCard(resultsContainer, card)); 
  btnSearch.classList.toggle("disabled"); //enable btn-search

} 



// fetch data and return data
async function getCardData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    //if theres an error send a default response 
    console.error('Failed to fetch card data', error.message);
    return { count: 0, data: [] };
  }

}


// function to build url from user  input
function buildURL() {
  const choice = document.querySelector('#search-name').value || ''; //change choice to search
  const option = document.querySelector('#set-select').value || ""; //change option to set
  const orderbyOp = document.querySelector('#order-cards-by').value; //change orderbyOp to orderBy
  console.log(option, 'option');

  //search with id
  //https://api.pokemontcg.io/v2/cards/xy1-1  //Venusaur-EX
  //https://api.pokemontcg.io/v2/cards/base1-4 //Charizard

  //search with q
  //https://api.pokemontcg.io/v2/cards?q=name:pikachu


  //build url to search by user input
  // rewrite  the logic below to reduce redundancy and make easier to read
  let url = `https://api.pokemontcg.io/v2/cards?`;

  if (option.length > 0 && choice.length > 0)
    url += `q=set.id:${option} name:${choice.toLocaleLowerCase()}*`;
  else if (option.length > 0 && choice.length <= 0)
    url += `q=set.id:${option}`;
  else if (choice.length > 0 && option.length <= 0)
    url += `q=name:${choice.toLocaleLowerCase()}*`;
  if (orderbyOp.length > 0 && (option.length > 0 || choice.length > 0))
    url += `&orderBy=${orderbyOp}`
  else if (orderbyOp.length > 0 && (option.length <= 0 && choice.length <= 0))
    url += `orderBy=${orderbyOp}`;

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

// have a loader when the data from the api is requested and waiting to complete
//hide search options 
//when data is fully retrieved hide loader and show search options

//********************************************************************************************************** */ 
//create function to hide section input for search options
//create function/functions to hide loader, notifySearch lbl and animations, hide no results lbl



//fill select options for sets
//https://api.pokemontcg.io/v2/sets"
//"https://api.pokemontcg.io/v2/sets?&orderBy=releaseDate"
fetch("https://api.pokemontcg.io/v2/sets?&orderBy=series")
  .then(res => res.json()) // parse response as JSON
  .then(data => {
    console.log(data)
    let select = document.querySelector("#set-select");
    data.data.forEach(set => {
      let option = document.createElement("option");
      option.value = set.id;
      option.innerHTML = set.name;
      select.appendChild(option);
    });
    // show section-input when data from api fills selects in options
    document.querySelector(".section-input").style.visibility = "visible";

    // hider loader
    document.querySelector(".search__loader").style.display = "none";
  })
  .catch(err => {
    console.log(`error ${err}`)
  });



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
    btnScroll.style.display = "block";
  } else {
    btnScroll.style.display = "none";
  }
}

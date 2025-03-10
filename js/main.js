/*
Try filtering set
Limit how many to display by search
create elements for each card entry
have multiple pages or display for long results
*/

// hide section-input when page loads
document.querySelector(".section-input").style.visibility = "hidden";

document.querySelector('.btn-search').addEventListener('click', getFetch)

function getFetch() {
   
  //make button inactive when search goes through
  document.querySelector(".btn-search").classList.toggle("disabled");

  //display searching when search btn clicked
  document.querySelector(".notify-searching").style.visibility = "visible";
 //toggle none so animation starts when searching
  document.querySelectorAll(".notify-searching__dot").forEach(node =>
    node.classList.toggle("none"));

  //hide no results when search btn is clicked
  document.querySelector(".notify-no-search").style.visibility = "hidden";

  const choice = document.querySelector('input').value || '';
  const option = document.querySelector('#set-select').value || "";
  const orderbyOp = document.querySelector('#order-cards-by').value;
  console.log(option, 'option');

  //search with id
  //https://api.pokemontcg.io/v2/cards/xy1-1  //Venusaur-EX
  //https://api.pokemontcg.io/v2/cards/base1-4 //Charizard

  //search with q
  //https://api.pokemontcg.io/v2/cards?q=name:pikachu



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


  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      //hide searching when data comes in
      document.querySelector(".notify-searching").style.visibility = "hidden";
      //toggle animation off so its not running when results come up
      document.querySelectorAll(".notify-searching__dot").forEach(node =>
        node.classList.toggle("none"));


      if (data.count == 0) {
        document.querySelector(".notify-no-search").style.visibility = "visible";

      }
      else {
        document.querySelector(".notify-no-search").style.visibility = "hidden";
      }



      //console.log(data)
      console.log(data);

      //get container holding cards
      let cardResults = document.querySelector(".cards-results");

      //make sure I have clean slate
      //delete all other entries
      if (cardResults.childElementCount > 0) {
        cardResults.innerHTML = '';

      }

      //loop all the cards from data
      //create elements for card h2:name, img, ul li span: types attack rarity price 
      //append to parent cardResults
      data.data.forEach(card => {

        //PROMISES MAKES THIS DIFFUCLT TO HANDLE PROPERTY NOT IN OBJ
        //not all cards havecardmarket or types or attack attribute //ERROR WITH PRICES ATTRIBUTE

        let cardMrkt = card.cardmarket ||= "N/A";
        //error keeps occurring when trying to check if attribute 
        //let cardMrktPrice = card?.cardmarket != undefined ? card.cardmarket.prices.averageSellPrice : 'N/A';
        let cardMrktPrice = cardMrkt != 'N/A' ? card.cardmarket.prices.averageSellPrice : 'N/A';

        let cardTypes = card.types ||= card.supertype ||= 'N/A';
        let cardAttacks = card.attacks ||= ["N/A", "N/A"]
        createCard(cardResults, card.name, card.set.series, card.set.name, card.images.small, cardTypes, cardAttacks, card.rarity, cardMrktPrice);

      });
      //after data loads toggle disable off for button search
      document.querySelector(".btn-search").classList.toggle("disabled");

    })

    .catch(err => {
      console.log(`error ${err}`)
    });

}

//create html for card
function createCard(containerAppend, name, series, set, img, types, attacks, rarity, cardMrkt) {
  let cardContainr = document.createElement("section");
  let list = document.createElement("ul");
  let h2Name = document.createElement("h2");
  let pkmSet = document.createElement("h2");
  let pkmSeries = document.createElement("h3");
  let pkmImg = document.createElement("img");
  let pkmTypes = document.createElement("li");
  let attack1 = document.createElement("li");
  let attack2 = document.createElement("li");
  let pkmRarity = document.createElement("li");
  let pkmAvgPrice = document.createElement("li");
  h2Name.innerHTML = name;
  pkmSeries.innerHTML = "Series: " + series;
  pkmSet.innerHTML = "Set: " + set;
  pkmImg.src = img;
  pkmTypes.innerHTML = "Type: " + types;
  //check if multiple attacks
  //maybe create muliple elements for attacks or add to single element
  if (attacks.length > 1 && typeof (attacks[0]) === 'object' && typeof (attacks[1]) === 'object') {
    attack1.innerHTML = 'Attack1:' + (attacks[0].name);
    attack2.innerHTML = 'Attack2: ' + (attacks[1].name);
  }
  else if (attacks.length === 1) {
    attack1.innerHTML = 'Attack1:' + (attacks[0].name);
    attack2.innerHTML = 'Attack2: N/A';
  }

  else {
    attack1.innerHTML = 'Attack1: N/A';
    attack2.innerHTML = 'Attack2: N/A';
  }

  pkmRarity.innerHTML = "Rarity: " + rarity;
  //some cards do no have attribute cardmarket
  if (cardMrkt != 'N/A')
    cardMrkt = Number(cardMrkt).toFixed(2);
  pkmAvgPrice.innerHTML = "AVG SellPrice: $" + cardMrkt;

  list.append(pkmTypes, attack1, attack2, pkmRarity, pkmAvgPrice);
  cardContainr.append(h2Name, pkmSet, pkmSeries, pkmImg, list);
  containerAppend.append(cardContainr);

}

// have a loader when the data from the api is requested and waiting to complete
//hide search options 
//when data is fully retrieved hide loader and show search options


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

let btnScroll = document.querySelector(".btn-scroll-up");


// Scroll up to top of page when scroll button clicked
btnScroll.addEventListener("click", (e) => {
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top

});


//display or hide button when window scrolls
// When the user scrolls down 100px from the top, show the button
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    btnScroll.style.display = "block";
  } else {
    btnScroll.style.display = "none";
  }
}

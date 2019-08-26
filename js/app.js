/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

const deck = document.querySelector('.deck');
let clickedClass = [];
let matched = 0;
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;
const TOTAL_PAIRS = 8;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

//...set up the event listener for a card. If a card is clicked:
//display the card's symbol


deck.addEventListener('click', function (event) {
	const clicked = event.target;
	
	if (clicked.classList.contains('card') && 
		clickedClass.length < 2 &&
		!clicked.classList.contains('match') &&
		!clickedClass.includes(clicked)) {
		toggleClass(clicked);
		addToggleClass(clicked);
		if (clickedClass.length === 2) {
			matchCheck(clicked);
			addMove();
			score();
		}

		//...if condition for starting timer

		if (clockOff) {
			startClock();
			clockOff = false;
		}
	}
});

function toggleClass(clicked) {
	clicked.classList.toggle('open');
	clicked.classList.toggle('show');
}

function addToggleClass(clicked) {
	clickedClass.push(clicked);
	console.log(clickedClass)
}

function isClickValid(clicked) {
	return (clicked.classList.contains('card') && 
			clickedClass.length < 2 &&
			!clicked.classList.contains('match') &&
			!clickedClass.includes(clicked));
}
//...if two clicked card match or not


function matchCheck() {
	if (clickedClass[0].firstElementChild.className === 
		clickedClass[1].firstElementChild.className) {
		setTimeout(function() {
			clickedClass[0].classList.toggle('match');
			clickedClass[1].classList.toggle('match');
			clickedClass = [];
			matched++;
			if (matched === TOTAL_PAIRS) {
				gameOver();
				console.log('gameover')
			}
			console.log('Match!');
		}, 700)
		
	} else {
		setTimeout(notMatch, 1000);
	}
}

//...else function
function notMatch() {
		toggleClass(clickedClass[0]);
		toggleClass(clickedClass[1]);
		clickedClass = [];
		console.log('Does not match!');
	}


//...shuffling card starts here
function shuffleDeck() {
	const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
	//console.log( 'card to shuffle', cardsToShuffle);
	const shuffled = shuffle(cardsToShuffle);
	//console.log(shuffled);
	for (card of shuffled) {
		deck.appendChild(card)
	}
}
shuffleDeck()

//...card moves starts here


function addMove() {
	moves++;
	const movesText = document.querySelector('.moves')
	movesText.innerHTML = moves;
}

//...Reduce star code starts here
function score() {
	if (moves === 16 || moves === 24) {
		reduceStar();
	}
}

function reduceStar() {
	const stars = document.querySelectorAll('.stars li')
	for (star of stars) {
		if (star.style.display !== 'none') {
			star.style.display = 'none';
			break;
		}
	}
}

//...clock timer code start here


function startClock() {
	clockId = setInterval( function() {
		time++;
		displayTime();
	}, 1000);
}

function displayTime() {
	const clock = document.querySelector('.clock');
	//console.log(clock);

	//...conversion of time to minutes & seconds start here
	const seconds = time % 60;
	const minutes = Math.floor(time / 60);
	if (seconds < 10) {
		clock.innerHTML = `${minutes}:0${seconds}`;
	} else {
		clock.innerHTML = `${minutes}:${seconds}`;
	}
	//...conversion of time to minutes & seconds ends here
}

function stopClock() {
    clearInterval(clockId);
}

//...Modal board starts here
function toggleModal() {
	const modal = document.querySelector('.modal__background');
	modal.classList.toggle('hide');
}

function writeModalStats() {
	const timeStat = document.querySelector('.modal__time');
	const clockTime = document.querySelector('.clock').innerHTML;
	const movesStat = document.querySelector('.modal__moves');
	const starsStat = document.querySelector('.modal__stars');
	const stars = getStars();

	timeStat.innerHTML = `Time = ${clockTime}`;
	movesStat.innerHTML = `Moves = ${moves}`;
	starsStat.innerHTML = `Stars = ${stars}`;
}

function getStars() {
	stars = document.querySelectorAll('.stars li');
	starCount = 0;
	for (star of stars) {
		if (star.style.display !== 'none') {
			starCount++;
		}
	}
	return starCount
}

//....Modal button code starts here
document.querySelector('.modal__cancel').addEventListener('click', function () {
	toggleModal();
});

/*document.querySelector('.modal__replay').addEventListener('click', function() {
	console.log('replay');
	// TODO: call reset game HERE
});*/

function resetGame() {
	matched= 0;
	clickedClass = [];
	resetClockAndTime();
	resetMoves();
	resetStars();
	resetCards();
	shuffleDeck();
}

function replayGame() {
	resetGame();
	toggleModal();
}

function resetClockAndTime() {
	stopClock();
	clockOff = true;
	time = 0;
	displayTime();
}

function resetMoves() {
	moves = 0;
	document.querySelector('.moves').innerHTML = moves;
}

function resetStars() {
	stas = 0;
	const stars = document.querySelectorAll('.stars li');
	for (star of stars) {
		star.style.display = 'inline';
		}
}

document.querySelector('.restart').addEventListener('click', resetGame);
document.querySelector('.modal__replay').addEventListener('click', replayGame);

//...calling on the modal
function gameOver() {
	stopClock();
	writeModalStats();
	toggleModal();
}

function resetCards() {
	const cards = document.querySelectorAll('.deck li');
	for (let card of cards) {
		card.className = 'card'
	}
}

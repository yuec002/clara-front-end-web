// --------------------
// STEPS OF 17
// --------------------

// My five dominoes.
// Each domino is stored as an object in an array.

const dominoes = [
  {
    id: 1,
    top: 0,
    bottom: 1
  },
  {
    id: 2,
    top: 0,
    bottom: 2
  },
  {
    id: 3,
    top: 1,
    bottom: 2
  },
  {
    id: 4,
    top: 2,
    bottom: 3
  },
  {
    id: 5,
    top: 1,
    bottom: 5
  }
];


// --------------------
// PIP POSITIONS
// --------------------

// Each number uses a 3 x 3 grid.
// The numbers represent positions in that grid.

const pipPositions = {
  0: [],

  1: [4],

  2: [0, 8],

  3: [0, 4, 8],

  4: [0, 2, 6, 8],

  5: [0, 2, 4, 6, 8],

  6: [0, 2, 3, 5, 6, 8]
};


// --------------------
// GET TOTAL
// --------------------

function getDominoTotal(domino) {
  return domino.top + domino.bottom;
}


// --------------------
// CREATE A DOMINO HALF
// --------------------

function createDominoFace(value) {

  const face = document.createElement("div");

  face.classList.add("domino-face");

  // Create 9 possible pip positions.
  for (let i = 0; i < 9; i++) {

    const pip = document.createElement("div");

    pip.classList.add("pip");

    // Add a dot if this position belongs to the number.
    if (pipPositions[value].includes(i)) {
      pip.classList.add("dot");
    }

    face.appendChild(pip);
  }

  return face;
}


// --------------------
// CREATE A DOMINO
// --------------------

function createDomino(domino) {

  const element = document.createElement("div");

  element.classList.add("domino");

  // Store the domino ID in the HTML.
  element.dataset.id = domino.id;

  // Create the top and bottom halves.
  const topFace = createDominoFace(domino.top);
  const bottomFace = createDominoFace(domino.bottom);

  // Store the values as data attributes too.
  topFace.dataset.value = domino.top;
  bottomFace.dataset.value = domino.bottom;

  element.appendChild(topFace);
  element.appendChild(bottomFace);

  // Clicking the domino flips it to its blank side.
  element.addEventListener("click", function () {

    element.classList.toggle("flipped");

  });

  return element;
}


// --------------------
// DISPLAY DOMINOES
// --------------------

function displayDominoes(list) {

  const container = document.getElementById("domino-container");

  // Clear the current dominoes.
  container.innerHTML = "";

  // Create each domino from the array of objects.
  list.forEach(function(domino) {

    const element = createDomino(domino);

    container.appendChild(element);

  });
}


// --------------------
// SORT ASCENDING
// --------------------

function sortAscending() {

  const sorted = [...dominoes].sort(function(a, b) {

    return getDominoTotal(a) - getDominoTotal(b);

  });

  displayDominoes(sorted);

  document.getElementById("message").textContent =
    "Sorted from smallest to largest.";
}


// --------------------
// SORT DESCENDING
// --------------------

function sortDescending() {

  const sorted = [...dominoes].sort(function(a, b) {

    return getDominoTotal(b) - getDominoTotal(a);

  });

  displayDominoes(sorted);

  document.getElementById("message").textContent =
    "Sorted from largest to smallest.";
}


// --------------------
// SUM OF 17
// --------------------

function showSum() {

  let total = 0;

  dominoes.forEach(function(domino) {

    total += getDominoTotal(domino);

  });

  if (total === 17) {

    displayDominoes(dominoes);

    document.getElementById("message").textContent =
      "Lucky 17! The five dominoes add up to 17.";

  } else {

    document.getElementById("message").textContent =
      "The total is " + total + ".";

  }
}


// --------------------
// BUTTON EVENTS
// --------------------

document
  .getElementById("ascending")
  .addEventListener("click", sortAscending);

document
  .getElementById("descending")
  .addEventListener("click", sortDescending);

document
  .getElementById("sum")
  .addEventListener("click", showSum);


// --------------------
// INITIAL DISPLAY
// --------------------

displayDominoes(dominoes);
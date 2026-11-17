
const grid = document.getElementById("chocolateGrid");
const surpriseButton = document.getElementById("surpriseButton");
const status = document.getElementById("status");
const boroughSelect = document.getElementById("borough");
const categoryButtons = document.querySelectorAll(".category-btn");

const API_URL = "https://data.cityofnewyork.us/resource/43nn-pn8j.json";

let selectedCategory = "all";

// 32 x 32 pixel-art mouse holding a flower
const ratSVG = `
<svg viewBox="0 0 32 32"
     xmlns="http://www.w3.org/2000/svg"
     shape-rendering="crispEdges">

  <!-- Tail -->
  <rect x="3" y="23" width="2" height="2" fill="#765447"/>
  <rect x="2" y="21" width="2" height="2" fill="#765447"/>
  <rect x="1" y="19" width="2" height="2" fill="#765447"/>
  <rect x="3" y="18" width="2" height="2" fill="#765447"/>

  <!-- Ears -->
  <rect x="8" y="5" width="6" height="7" fill="#765447"/>
  <rect x="19" y="5" width="6" height="7" fill="#765447"/>
  <rect x="10" y="7" width="3" height="3" fill="#E7A4B2"/>
  <rect x="20" y="7" width="3" height="3" fill="#E7A4B2"/>

  <!-- Head -->
  <rect x="7" y="10" width="19" height="13" fill="#A98772"/>
  <rect x="9" y="8" width="15" height="16" fill="#B99A83"/>
  <rect x="7" y="13" width="2" height="6" fill="#A98772"/>
  <rect x="24" y="13" width="2" height="6" fill="#A98772"/>

  <!-- Eyes -->
  <rect x="12" y="14" width="2" height="2" fill="#30251F"/>
  <rect x="21" y="14" width="2" height="2" fill="#30251F"/>

  <!-- Muzzle -->
  <rect x="15" y="17" width="5" height="3" fill="#E5C7B4"/>
  <rect x="17" y="17" width="2" height="2" fill="#765447"/>

  <!-- Cheeks -->
  <rect x="9" y="18" width="3" height="2" fill="#D99AA1"/>
  <rect x="22" y="18" width="3" height="2" fill="#D99AA1"/>

  <!-- Body -->
  <rect x="9" y="22" width="15" height="6" fill="#A98772"/>
  <rect x="12" y="21" width="10" height="7" fill="#B99A83"/>
  <rect x="11" y="26" width="4" height="2" fill="#765447"/>
  <rect x="20" y="26" width="4" height="2" fill="#765447"/>

  <!-- Flower stem -->
  <rect x="28" y="10" width="1" height="13" fill="#66845B"/>
  <rect x="26" y="19" width="3" height="1" fill="#66845B"/>

  <!-- Flower petals -->
  <rect x="27" y="4" width="3" height="3" fill="#E995B1"/>
  <rect x="24" y="7" width="3" height="3" fill="#E995B1"/>
  <rect x="30" y="7" width="2" height="3" fill="#E995B1"/>
  <rect x="27" y="10" width="3" height="2" fill="#E995B1"/>

  <!-- Flower center -->
  <rect x="27" y="7" width="3" height="3" fill="#F5D477"/>

</svg>
`;

function createCards() {
  grid.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-back">
          <div class="rat-sprite">${ratSVG}</div>
          <span class="card-label">MYSTERY #${i + 1}</span>
        </div>

        <div class="card-front">
          <p>Your surprise is waiting...</p>
        </div>
      </div>
    `;

    grid.appendChild(card);
  }
}

// Category selection
categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    categoryButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    selectedCategory = button.dataset.category;
  });
});

// Shuffle results
function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

// Approximate café classification using cuisine descriptions
function isCafe(place) {
  const cuisine = (place.cuisine_description || "").toLowerCase();

  const cafeKeywords = [
    "cafe",
    "café",
    "coffee",
    "tea",
    "bakery",
    "bagel",
    "donut",
    "pastry",
    "juice",
    "smoothie",
    "ice cream",
    "gelato"
  ];

  return cafeKeywords.some(keyword => cuisine.includes(keyword));
}

function filterPlaces(places) {
  if (selectedCategory === "cafe") {
    return places.filter(isCafe);
  }

  if (selectedCategory === "restaurant") {
    return places.filter(place => !isCafe(place));
  }

  return places;
}

// Build a card with restaurant information
function displayPlace(card, place) {
  const front = card.querySelector(".card-front");
  front.replaceChildren();

  const name = document.createElement("h3");
  name.textContent = place.dba || "Unknown Place";

  const cuisine = document.createElement("p");
  cuisine.className = "cuisine";
  cuisine.textContent = place.cuisine_description || "Cuisine unavailable";

  const location = document.createElement("p");
  location.textContent = [place.street, place.boroName]
    .filter(Boolean)
    .join(", ");

  const grade = document.createElement("p");
  grade.textContent = place.grade
    ? `Grade: ${place.grade}`
    : "Grade unavailable";

  const address = [
    place.building,
    place.street,
    place.boroName,
    "NY",
    place.zipcode
  ].filter(Boolean).join(" ");

  const link = document.createElement("a");
  link.href =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(address);

  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.className = "map-link";
  link.textContent = "Find on Maps ↗";

  front.append(name, cuisine, location, grade, link);
}

// Reset cards before each search
function resetCards() {
  gsap.set(".card-inner", { rotateY: 0 });

  const cards = document.querySelectorAll(".card");

  cards.forEach((card, index) => {
    card.querySelector(".card-front").innerHTML =
      "<p>Waiting for a surprise...</p>";

    card.querySelector(".card-label").textContent =
      `MYSTERY #${index + 1}`;
  });
}

// Fetch restaurant data from NYC Open Data
async function getPlaces() {
  surpriseButton.disabled = true;
  surpriseButton.textContent = "Finding surprises... ♡";
  status.textContent = "Mochi is searching NYC for you...";

  resetCards();

  try {
    const params = new URLSearchParams();

    params.set(
      "$select",
      "camis,dba,boro,building,street,zipcode,cuisine_description,grade,inspection_date"
    );

    params.set("$order", "inspection_date DESC");
    params.set("$limit", "5000");

    // Borough codes in the NYC dataset:
    // 1 Manhattan, 2 Bronx, 3 Brooklyn, 4 Queens, 5 Staten Island
    const borough = boroughSelect.value;

    if (borough !== "ALL") {
      params.set("$where", `boro = '${borough}' AND camis IS NOT NULL`);
    } else {
      params.set("$where", "camis IS NOT NULL");
    }

    const requestURL = `${API_URL}?${params.toString()}`;

    const response = await fetch(requestURL);

    if (!response.ok) {
      throw new Error(`NYC Open Data error: ${response.status}`);
    }

    const data = await response.json();

    // Convert borough codes into readable names
    const boroughNames = {
      "1": "Manhattan",
      "2": "Bronx",
      "3": "Brooklyn",
      "4": "Queens",
      "5": "Staten Island"
    };

    // Keep the most recent record for each restaurant
    const uniquePlaces = new Map();

    data.forEach(place => {
      if (place.camis && !uniquePlaces.has(place.camis)) {
        uniquePlaces.set(place.camis, {
          ...place,
          boroName: boroughNames[place.boro] || place.boro
        });
      }
    });

    const uniqueResults = Array.from(uniquePlaces.values());
    const filteredPlaces = filterPlaces(uniqueResults);

    if (filteredPlaces.length === 0) {
      throw new Error(
        "No matches found. Try another category or borough!"
      );
    }

    const selectedPlaces = shuffleArray(filteredPlaces).slice(0, 9);
    const cards = document.querySelectorAll(".card");

    selectedPlaces.forEach((place, index) => {
      displayPlace(cards[index], place);
    });

    for (let i = selectedPlaces.length; i < 9; i++) {
      cards[i].querySelector(".card-front").innerHTML =
        "<p>No more surprises here!</p>";
    }

    // Flip all nine cards with a staggered animation
    gsap.to(".card-inner", {
      rotateY: 180,
      duration: 0.8,
      stagger: 0.12,
      ease: "power2.inOut",
      delay: 0.2
    });

    status.textContent =
      `${selectedPlaces.length} little NYC discoveries found! ♡`;
  }

  catch (error) {
    console.error("API Error:", error);
    status.textContent = error.message;
  }

  finally {
    surpriseButton.disabled = false;
    surpriseButton.textContent = "Surprise Me Again! ✨";
  }
}

surpriseButton.addEventListener("click", getPlaces);

// Create the nine mystery cards on page load
createCards();

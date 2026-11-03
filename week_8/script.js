
const dominoContainer = document.getElementById("domino-container");
const dominoes = Array.from(document.querySelectorAll(".domino"));
const message = document.getElementById("message");

// Standard pip positions
const pipPositions = {
    0: [],
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8]
};

// Calculate the total of a domino
function getDominoTotal(domino) {
    const faces = domino.querySelectorAll(".domino-face");

    return Number(faces[0].dataset.value) +
           Number(faces[1].dataset.value);
}

// Generate the dots
dominoes.forEach(function(domino) {

    const faces = domino.querySelectorAll(".domino-face");

    faces.forEach(function(face) {

        const value = Number(face.dataset.value);

        face.innerHTML = "";

        for (let i = 0; i < 9; i++) {

            const pip = document.createElement("div");
            pip.classList.add("pip");

            if (pipPositions[value].includes(i)) {
                pip.classList.add("dot");
            }

            face.appendChild(pip);
        }
    });

    // Flip on click
    domino.addEventListener("click", function() {
        domino.classList.toggle("flipped");
    });
});

// Display dominoes in a specific order
function arrangeDominoes(list) {

    list.forEach(function(domino) {
        domino.classList.remove("flipped");
        dominoContainer.appendChild(domino);
    });

}

// ASCENDING
document.getElementById("ascending").addEventListener("click", function() {

    const sorted = [...dominoes].sort(function(a, b) {
        return getDominoTotal(a) - getDominoTotal(b);
    });

    arrangeDominoes(sorted);

    message.textContent = "Sorted: Lowest to Highest";
});

// DESCENDING
document.getElementById("descending").addEventListener("click", function() {

    const sorted = [...dominoes].sort(function(a, b) {
        return getDominoTotal(b) - getDominoTotal(a);
    });

    arrangeDominoes(sorted);

    message.textContent = "Sorted: Highest to Lowest";
});

// SUM OF 17
document.getElementById("sum-17").addEventListener("click", function() {

    const total = dominoes.reduce(function(sum, domino) {
        return sum + getDominoTotal(domino);
    }, 0);

    if (total === 17) {

        const sorted = [...dominoes].sort(function(a, b) {
            return getDominoTotal(a) - getDominoTotal(b);
        });

        arrangeDominoes(sorted);

        message.textContent = "Success! The total is 17!";

    } else {

        message.textContent = "The total is " + total + ", not 17.";

    }
});

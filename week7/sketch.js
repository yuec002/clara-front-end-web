
let title = document.getElementById("title");
let message = document.getElementById("message");

let button = document.getElementById("change-button");
let surpriseButton = document.getElementById("surprise-button");

let gift = document.getElementById("gift");

let popup = document.getElementById("surprise-popup");
let popupArt = document.getElementById("popup-art");
let popupTitle = document.getElementById("popup-title");
let popupMessage = document.getElementById("popup-message");
let closePopup = document.getElementById("close-popup");
let popupOk = document.getElementById("popup-ok");

let flower = "🌸";

let cloud = [
  "    .-~~~-.",
  " .-~       ~-.",
  "(             )",
  " '-._________.-'"
].join("\n");

console.log("My JavaScript file is connected!");

function showGift(art, kind) {
  gift.textContent = art;
  gift.className = "gift " + kind;

  popupArt.textContent = art;
  popupArt.className = "popup-art " + kind;
}

function openPopup(heading, text) {
  popupTitle.textContent = heading;
  popupMessage.textContent = text;
  popup.classList.add("show");
}

function closePopupBox() {
  popup.classList.remove("show");
}

// Surprise One: a little flower
button.addEventListener("click", function() {
  title.textContent = "Welcome to Surprise Maker";
  title.style.color = "#542b40";
  message.textContent = "A flower for you";

  document.body.style.backgroundColor = "#fce4ec";
  showGift(flower, "flower");

  openPopup("Surprise One", "A flower for you");
});

// Surprise 2: blue sky and a little cloud
surpriseButton.addEventListener("click", function() {
  title.textContent = "Welcome to Surprise Maker";
  title.style.color = "#542b40";
  message.textContent = "A little cloud for you";

  document.body.style.backgroundColor = "#b9dcff";
  showGift(cloud, "cloud");

  openPopup("Surprise 2", "A little cloud for you");
});

closePopup.addEventListener("click", closePopupBox);
popupOk.addEventListener("click", closePopupBox);

popup.addEventListener("click", function(event) {
  if (event.target === popup) {
    closePopupBox();
  }
});


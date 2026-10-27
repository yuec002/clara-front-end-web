
let title = document.getElementById("title");
let message = document.getElementById("message");

let button = document.getElementById("change-button");
let surpriseButton = document.getElementById("surprise-button");

console.log("My JavaScript file is connected!");

// Change the story button
button.addEventListener("click", function() {
  title.textContent = "You Changed the Story! ✿";
  title.style.color = "#542b40";

  message.textContent =
    "The page responded to your action. You're the author of this little world!";

  document.body.style.backgroundColor = "#d9eaff";
});

// Surprise button
surpriseButton.addEventListener("click", function() {
  title.textContent = "The Secret Is Out ✨";
  title.style.color = "#e75480";

  message.textContent =
    "You were not supposed to find this. You are a little ray of sunshine. ♡";

  document.body.style.backgroundColor = "#ffd6e7";

  surpriseButton.textContent = "Surprise Unlocked! 💗";
});


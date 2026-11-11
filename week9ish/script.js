
const surpriseForm = document.getElementById("surprise-form");
const personalResult = document.getElementById("personal-result");

const resultTitle = document.getElementById("result-title");
const resultMessage = document.getElementById("result-message");
const resultAction = document.getElementById("result-action");

const anotherButton = document.getElementById("another-surprise");

let currentMood = "";
let currentName = "";

// Different surprises for different moods
const surprises = {
  happy: {
    title: "Keep That Sunshine! ☀️",
    messages: [
      "The world is a little brighter because you're in it.",
      "Whatever you're doing, keep doing it. You're glowing.",
      "Here's your reminder to enjoy the little things."
    ],
    action: "Your mission: Take a picture of something beautiful today."
  },

  sad: {
    title: "A Little Hug for You ♡",
    messages: [
      "It's okay to have days that aren't so great.",
      "You don't have to have everything figured out right now.",
      "Even flowers need rainy days to grow."
    ],
    action: "Your mission: Do one small thing that makes you comfortable."
  },

  stressed: {
    title: "Pause for a Second 🌷",
    messages: [
      "Take a breath. You are doing better than you think.",
      "You don't have to finish everything today.",
      "One thing at a time. That's enough."
    ],
    action: "Your mission: Step away from your screen for five minutes."
  },

  bored: {
    title: "Boredom Emergency! 🪄",
    messages: [
      "Your next adventure is waiting somewhere unexpected.",
      "What if today was the beginning of a new story?",
      "Let's make something happen!"
    ],
    action: "Your mission: Find something blue within five seconds."
  },

  excited: {
    title: "AAAA THE ENERGY!! ✨",
    messages: [
      "I LOVE this energy. Keep chasing what excites you.",
      "Something tells me today is going to be special.",
      "You deserve to celebrate every little win."
    ],
    action: "Your mission: Tell someone about the thing you're excited for."
  },

  lost: {
    title: "A Little Reminder 🌙",
    messages: [
      "You can change directions without being lost.",
      "Not knowing what comes next doesn't mean you're behind.",
      "Sometimes the best things happen when you don't have a map."
    ],
    action: "Your mission: Write down one thing you want to try."
  }
};

// Generate a surprise
function makeSurprise() {
  const moodSurprises = surprises[currentMood];

  const randomMessage =
    moodSurprises.messages[
      Math.floor(Math.random() * moodSurprises.messages.length)
    ];

  resultTitle.textContent = `${moodSurprises.title}`;
  resultMessage.textContent =
    `${currentName}, ${randomMessage}`;
  resultAction.textContent = moodSurprises.action;

  // Update the page
  personalResult.hidden = false;
  personalResult.classList.remove("result");
  void personalResult.offsetWidth;
  personalResult.classList.add("result");
}

// Listen for form submission
surpriseForm.addEventListener("submit", function(event) {
  event.preventDefault();

  currentName = document
    .getElementById("visitor-name")
    .value.trim();

  currentMood = document.getElementById("visitor-mood").value;

  if (currentName === "") {
    alert("Wait! I need your name first ♡");
    return;
  }

  if (!surprises[currentMood]) {
    alert("Choose a mood so I can make something for you!");
    return;
  }

  makeSurprise();
});

// Give the visitor another surprise
anotherButton.addEventListener("click", function() {
  makeSurprise();
});


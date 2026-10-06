const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const playerImage = new Image();
playerImage.src = "./player.png";

ctx.imageSmoothingEnabled = false;

const dialogue = document.getElementById("dialogue");
const speaker = document.getElementById("speaker");
const dialogueText = document.getElementById("dialogueText");
const choices = document.getElementById("choices");

const player = {
  x: 120,
  y: 320,
  speed: 180
};

const guide = {
  x: 560,
  y: 220,
  name: "Mysterious Stranger"
};

const keys = new Set();
let talking = false;
let missionComplete = false;

// Listen for movement keys and the talk key.
document.addEventListener("keydown", function (event) {
  const key = event.key.toLowerCase();

  if (
    ["arrowup", "arrowdown", "arrowleft", "arrowright",
     "w", "a", "s", "d", "e"].includes(key)
  ) {
    event.preventDefault();
  }

  keys.add(key);

  if (key === "e" && !event.repeat && !talking && nearGuide()) {
    startConversation();
  }
});

document.addEventListener("keyup", function (event) {
  keys.delete(event.key.toLowerCase());
});

// Stop movement if the browser loses focus.
window.addEventListener("blur", function () {
  keys.clear();
});

function nearGuide() {
  const distance = Math.hypot(
    player.x - guide.x,
    player.y - guide.y
  );

  return distance < 85;
}

// Display dialogue and create its buttons.
function showDialogue(text, options) {
  talking = true;
  keys.clear();
  dialogue.hidden = false;
  speaker.textContent = guide.name;
  dialogueText.textContent = text;
  choices.replaceChildren();

  options.forEach(function (option) {
    const button = document.createElement("button");
    button.textContent = option.text;
    button.onclick = option.action;
    choices.appendChild(button);
  });
}

function closeDialogue() {
  talking = false;
  keys.clear();
  dialogue.hidden = true;
}

function startConversation() {
  if (missionComplete) {
    showDialogue(
      "Your first clue is the café. Your adventure is just beginning!",
      [{ text: "Keep exploring", action: closeDialogue }]
    );
    return;
  }

  showDialogue(
    "Salam Omid! Tavalodet mobarak! Are you ready for your birthday mission?",
    [
      {
        text: "A mission? Tell me more!",
        action: showQuestion
      },
      {
        text: "Talk later",
        action: closeDialogue
      }
    ]
  );
}

function showQuestion() {
  showDialogue(
    'Your first clue says: "Boro be kafe." Where should you go?',
    [
      {
        text: "The coffee shop",
        action: correctAnswer
      },
      {
        text: "The airport",
        action: wrongAnswer
      },
      {
        text: "Straight back to bed",
        action: wrongAnswer
      }
    ]
  );
}

function wrongAnswer() {
  showDialogue(
    "The stranger raises an eyebrow. That birthday plan sounds mahi mahi… Try again!",
    [
      {
        text: "← Back / Try again",
        action: showQuestion
      }
    ]
  );
}

function correctAnswer() {
  missionComplete = true;

  showDialogue(
    "Correct! Your first clue leads to the coffee shop. First mission complete!",
    [
      {
        text: "Keep exploring",
        action: closeDialogue
      }
    ]
  );
}

// Draw a simple temporary character.
// x and y mark the character's feet.
function drawCharacter(x, y, shirt, jeans, glasses) {
  ctx.fillStyle = jeans;
  ctx.fillRect(x - 12, y - 20, 10, 20);
  ctx.fillRect(x + 2, y - 20, 10, 20);

  ctx.fillStyle = shirt;
  ctx.fillRect(x - 14, y - 44, 28, 26);

  ctx.fillStyle = "#dca574";
  ctx.fillRect(x - 12, y - 66, 24, 22);

  ctx.fillStyle = "#171717";
  ctx.fillRect(x - 13, y - 69, 26, 9);

  if (glasses) {
    ctx.strokeStyle = "#171717";
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 10, y - 58, 8, 7);
    ctx.strokeRect(x + 2, y - 58, 8, 7);
    ctx.fillStyle = "#171717";
    ctx.fillRect(x - 2, y - 56, 4, 2);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Grass and a path.
  ctx.fillStyle = "#839466";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#c7b58b";
  ctx.fillRect(0, 280, canvas.width, 100);
  ctx.fillRect(510, 160, 100, 220);

  // Draw characters in order so the lower one appears in front.
  const characters = [
    { ...player, shirt: "#657343", jeans: "#477bb2", glasses: true },
    { ...guide, shirt: "#a7664e", jeans: "#403d38", glasses: false }
  ];

  characters.sort(function (a, b) {
    return a.y - b.y;
  });

  characters.forEach(function (character) {
  if (
    character.glasses &&
    playerImage.complete &&
    playerImage.naturalWidth > 0
  ) {
    const height = 90;
    const width =
      height * playerImage.naturalWidth / playerImage.naturalHeight;

    ctx.drawImage(
      playerImage,
      character.x - width / 2,
      character.y - height,
      width,
      height
    );
  } else {
    drawCharacter(
      character.x,
      character.y,
      character.shirt,
      character.jeans,
      character.glasses
    );
  }
});

  ctx.font = "16px monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = "#25291f";
  ctx.fillText(guide.name, guide.x, guide.y - 85);

  if (nearGuide() && !talking) {
    ctx.fillStyle = "#25291f";
    ctx.fillRect(guide.x - 90, guide.y + 12, 180, 30);

    ctx.fillStyle = "#f5ecd7";
    ctx.fillText("Press E to talk", guide.x, guide.y + 33);
  }

  ctx.textAlign = "left";
  ctx.fillStyle = "#25291f";
  ctx.fillText(
    missionComplete
      ? "Mission 1 complete! Next stop: café."
      : "Mission 1: Find the stranger and talk.",
    20,
    30
  );
}

// Update movement and redraw every animation frame.
let lastTime = null;

function gameLoop(time) {
  const seconds = lastTime === null
    ? 0
    : Math.min((time - lastTime) / 1000, 0.05);

  lastTime = time;

  if (!talking) {
    let dx = 0;
    let dy = 0;

    if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
    if (keys.has("arrowright") || keys.has("d")) dx += 1;
    if (keys.has("arrowup") || keys.has("w")) dy -= 1;
    if (keys.has("arrowdown") || keys.has("s")) dy += 1;

    const length = Math.hypot(dx, dy);

    if (length > 0) {
      player.x += (dx / length) * player.speed * seconds;
      player.y += (dy / length) * player.speed * seconds;
    }

    // Keep the entire character inside the screen.
    player.x = Math.max(16, Math.min(canvas.width - 16, player.x));
    player.y = Math.max(70, Math.min(canvas.height - 5, player.y));
  }

  draw();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
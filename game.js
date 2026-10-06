import { conversations } from "./story.js";
import { openBirthdayPhone } from "./phone.js";

// ---------- SETUP ----------

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const dialogue = document.getElementById("dialogue");
const speaker = document.getElementById("speaker");
const dialogueText = document.getElementById("dialogueText");
const choices = document.getElementById("choices");

const playerImage = new Image();
playerImage.src = "./player.png";

const player = { x: 120, y: 320, speed: 180 };
const stranger = { x: 550, y: 230 };
const barista = { x: 290, y: 170 };
const seat = { x: 690, y: 250 };
const door = { x: 730, y: 180 };
const ashley = { x: 530, y: 290 };

const keys = new Set();

let location = "outside";
let talking = false;
let forecastUnlocked = false;
let hasCoffee = false;
let coding = false;
let phoneOpen = false;
let lastTime = null;
let heartEyes = false;
let runningToMec = false;
let reachedMec = false;
let riding = false;
let rideProgress = 0;
let foodChosen = false;

// ---------- DIALOGUE ----------

function closeDialogue() {
  talking = false;
  keys.clear();
  dialogue.hidden = true;
}

function showMessage(name, text, buttonText, action) {
  talking = true;
  keys.clear();
  dialogue.hidden = false;
  speaker.textContent = name;
  dialogueText.textContent = text;
  choices.replaceChildren();

  const button = document.createElement("button");
  button.textContent = buttonText;
  button.onclick = action;
  choices.appendChild(button);
}

const actions = {
  close: closeDialogue,

  unlockForecast() {
    forecastUnlocked = true;
    closeDialogue();
  },

  takeCoffee() {
    hasCoffee = true;
    closeDialogue();
  },

  beginCoding() {
    coding = true;
    player.x = seat.x;
    player.y = seat.y;
    closeDialogue();

    window.setTimeout(function () {
      showConversation("threeHoursLater");
    }, 1800);
  },

  openPhone() {
    closeDialogue();
    phoneOpen = true;

    openBirthdayPhone(function () {
      phoneOpen = false;
      coding = false;
      heartEyes = true;
      runningToMec = true;
      location = "mecRoute";
      player.x = 80;
      player.y = 320;
      keys.clear();
    });
  },

  enterMec() {
    location = "mecInside";
    player.x = 180;
    player.y = 380;
    heartEyes = false;
    closeDialogue();
  },

  startBikeRide() {
    location = "mountains";
    riding = true;
    rideProgress = 0;
    player.x = 365;
    player.y = 365;
    closeDialogue();
  },

  chooseKoobideh() {
    foodChosen = true;
    player.x = 210;
    player.y = 320;
    closeDialogue();
  }
};

function showConversation(id) {
  const conversation = conversations[id];

  if (!conversation) {
    showMessage(
      "Missing story scene",
      `Please check that story.js contains the scene "${id}".`,
      "Back",
      closeDialogue
    );
    return;
  }

  talking = true;
  keys.clear();
  dialogue.hidden = false;
  speaker.textContent = conversation.speaker;
  dialogueText.textContent = conversation.text;
  choices.replaceChildren();

  conversation.choices.forEach(function (choice) {
    const button = document.createElement("button");
    button.textContent = choice.text;

    button.onclick = function () {
      if (choice.next) {
        showConversation(choice.next);
      } else if (typeof actions[choice.action] === "function") {
        actions[choice.action]();
      } else {
        showMessage(
          "Missing story action",
          `The action "${choice.action}" is not in game.js.`,
          "Back",
          function () {
            showConversation(id);
          }
        );
      }
    };

    choices.appendChild(button);
  });
}

function showDialogueForMec() {
  showMessage(
    "MEC",
    "Omid reaches MEC. Through the windows, he spots kayaks, climbing gear, and rows of bikes.",
    "Enter MEC",
    actions.enterMec
  );
}

// ---------- INTERACTIONS ----------

function near(target, distance = 75) {
  return Math.hypot(
    player.x - target.x,
    player.y - target.y
  ) < distance;
}

function getInteraction() {
  if (coding || phoneOpen || runningToMec || riding) {
    return null;
  }

  if (location === "mecInside") {
    if (near(ashley, 100)) {
      return {
        prompt: "E: Talk to Ashley",
        run() {
          showConversation("ashleyBikes");
        }
      };
    }

    return null;
  }

  if (location === "mountains" || location === "mecRoute") {
    return null;
  }

  if (location === "outside") {
    if (near(door, 55)) {
      return {
        prompt: forecastUnlocked
          ? "E: Enter Forecast"
          : "E: Check Forecast",

        run() {
          if (!forecastUnlocked) {
            showMessage(
              "Forecast",
              "Talk to the stranger first to begin your mission.",
              "Back",
              closeDialogue
            );
            return;
          }

          location = "forecast";
          player.x = 400;
          player.y = 420;
          keys.clear();
        }
      };
    }

    if (near(stranger)) {
      return {
        prompt: "E: Talk",
        run() {
          showConversation(
            forecastUnlocked ? "reminder" : "stranger"
          );
        }
      };
    }
  }

  if (location === "forecast") {
    if (near(barista, 95)) {
      return {
        prompt: "E: Talk to barista",
        run() {
          showConversation(
            hasCoffee ? "coffeeReminder" : "barista"
          );
        }
      };
    }

    if (hasCoffee && near(seat)) {
      return {
        prompt: "E: Sit and open laptop",
        run() {
          showConversation("coding");
        }
      };
    }
  }

  return null;
}

// ---------- KEYBOARD ----------

document.addEventListener("keydown", function (event) {
  const key = event.key.toLowerCase();

  // Leave the phone's buttons usable with the keyboard.
  if (phoneOpen) return;

  const controls = [
    "arrowup", "arrowdown", "arrowleft", "arrowright",
    "w", "a", "s", "d", "e"
  ];

  if (controls.includes(key)) {
    event.preventDefault();
  }

  if (talking || coding || runningToMec || riding) {
    return;
  }

  keys.add(key);

  if (key === "e" && !event.repeat) {
    const interaction = getInteraction();

    if (interaction) {
      interaction.run();
    }
  }
});

document.addEventListener("keyup", function (event) {
  keys.delete(event.key.toLowerCase());
});

window.addEventListener("blur", function () {
  keys.clear();
});

// ---------- DRAWING HELPERS ----------

function rectangle(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function label(text, x, y, color = "#25291f") {
  ctx.fillStyle = color;
  ctx.font = "16px monospace";
  ctx.textAlign = "center";
  ctx.fillText(text, x, y);
}

function drawPerson(person, shirt) {
  rectangle(person.x - 12, person.y - 20, 24, 20, "#403d38");
  rectangle(person.x - 14, person.y - 44, 28, 26, shirt);
  rectangle(person.x - 12, person.y - 66, 24, 22, "#dca574");
  rectangle(person.x - 13, person.y - 69, 26, 9, "#171717");
}

function drawPlayer() {
  if (playerImage.complete && playerImage.naturalWidth > 0) {
    const height = 90;
    const width =
      height * playerImage.naturalWidth / playerImage.naturalHeight;

    ctx.drawImage(
      playerImage,
      player.x - width / 2,
      player.y - height,
      width,
      height
    );
  } else {
    drawPerson(player, "#657343");
  }
}

function drawAshley(x, y) {
  rectangle(x - 17, y - 72, 34, 47, "#795132");

  drawPerson({ x, y }, "#c68e77");

  rectangle(x - 17, y - 72, 34, 10, "#795132");
  rectangle(x - 17, y - 62, 6, 35, "#795132");
  rectangle(x + 11, y - 62, 6, 35, "#795132");
}

function drawBike(x, y, color) {
  ctx.strokeStyle = "#25291f";
  ctx.lineWidth = 3;

  // Wheels.
  ctx.beginPath();
  ctx.arc(x - 23, y, 16, 0, Math.PI * 2);
  ctx.moveTo(x + 39, y);
  ctx.arc(x + 23, y, 16, 0, Math.PI * 2);
  ctx.stroke();

  // Frame.
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - 23, y);
  ctx.lineTo(x - 5, y - 27);
  ctx.lineTo(x + 8, y);
  ctx.lineTo(x - 23, y);
  ctx.moveTo(x - 5, y - 27);
  ctx.lineTo(x + 13, y - 27);
  ctx.lineTo(x + 8, y);
  ctx.lineTo(x + 23, y);
  ctx.lineTo(x + 13, y - 35);
  ctx.stroke();

  rectangle(x - 13, y - 32, 16, 4, "#25291f");
  rectangle(x + 9, y - 39, 17, 4, "#25291f");
}

function drawMountain(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width / 2, y - height);
  ctx.lineTo(x + width, y);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#f5ecd7";
  ctx.beginPath();
  ctx.moveTo(x + width / 2, y - height);
  ctx.lineTo(x + width / 2 - 20, y - height + 35);
  ctx.lineTo(x + width / 2 + 20, y - height + 35);
  ctx.closePath();
  ctx.fill();
}

// ---------- OUTSIDE FORECAST ----------

function drawOutside() {
  rectangle(0, 0, 800, 480, "#839466");

  rectangle(0, 280, 800, 100, "#c7b58b");
  rectangle(510, 180, 100, 200, "#c7b58b");
  rectangle(560, 180, 220, 55, "#c7b58b");

  rectangle(680, 80, 100, 100, "#b7835a");
  rectangle(672, 65, 116, 20, "#654735");

  rectangle(
    715,
    135,
    30,
    45,
    forecastUnlocked ? "#e9bd70" : "#403d38"
  );

  label("Forecast", 730, 115, "#f5ecd7");
  label("Stranger", stranger.x, stranger.y - 85);

  if (player.y < stranger.y) {
    drawPlayer();
    drawPerson(stranger, "#a7664e");
  } else {
    drawPerson(stranger, "#a7664e");
    drawPlayer();
  }
}

// ---------- INSIDE FORECAST ----------

function drawForecast() {
  rectangle(0, 0, 800, 480, "#c5aa83");
  rectangle(0, 0, 800, 90, "#676f50");
  label("FORECAST", 400, 55, "#f5ecd7");

  for (let y = 100; y < 480; y += 40) {
    rectangle(0, y, 800, 2, "#b59a73");
  }

  // Counter and barista.
  rectangle(100, 110, 350, 35, "#654735");
  drawPerson(barista, "#a7664e");
  rectangle(100, 175, 350, 45, "#8c674c");
  label("Barista", barista.x, 105, "#f5ecd7");

  // Espresso machine.
  rectangle(130, 125, 65, 42, "#393d3c");
  rectangle(140, 135, 45, 15, "#b5b9b2");

  // Outlets.
  rectangle(763, 150, 25, 40, "#f5ecd7");
  rectangle(768, 160, 4, 6, "#403d38");
  rectangle(779, 160, 4, 6, "#403d38");
  rectangle(768, 175, 4, 6, "#403d38");
  rectangle(779, 175, 4, 6, "#403d38");
  label("Outlets", 720, 135);

  // Chair and player.
  rectangle(675, 225, 30, 35, "#657343");
  drawPlayer();

  // Table.
  rectangle(630, 265, 120, 50, "#76563f");
  rectangle(640, 315, 8, 30, "#493626");
  rectangle(732, 315, 8, 30, "#493626");

  if (coding) {
    // Laptop.
    rectangle(660, 244, 55, 35, "#30363b");
    rectangle(665, 249, 45, 25, "#18232a");
    rectangle(655, 279, 65, 6, "#a0a5a7");

    rectangle(669, 253, 23, 2, "#94c789");
    rectangle(674, 259, 29, 2, "#e9bd70");
    rectangle(674, 265, 20, 2, "#94c789");

    // Flat white.
    rectangle(730, 270, 12, 14, "#f5ecd7");

    // Power cable.
    ctx.strokeStyle = "#403d38";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(715, 278);
    ctx.lineTo(775, 278);
    ctx.lineTo(775, 185);
    ctx.stroke();
  }
}

// ---------- RUN TO MEC ----------

function drawMecRoute() {
  rectangle(0, 0, 800, 480, "#839466");
  rectangle(0, 280, 800, 100, "#c7b58b");

  rectangle(640, 130, 145, 180, "#687361");
  rectangle(630, 115, 165, 25, "#394c3d");

  label("MEC", 713, 170, "#f5ecd7");

  rectangle(655, 190, 40, 45, "#bad4d5");
  rectangle(735, 190, 35, 45, "#bad4d5");
  rectangle(700, 245, 35, 65, "#e9bd70");
  rectangle(690, 310, 55, 70, "#c7b58b");

  drawPlayer();

  if (heartEyes) {
    label("♥ ♥", player.x, player.y - 65, "#ee5574");
  }
}

// ---------- INSIDE MEC ----------

function drawMecInside() {
  rectangle(0, 0, 800, 480, "#d0c5ad");
  rectangle(0, 30, 800, 80, "#536b50");
  label("MEC — ADVENTURE STARTS HERE", 400, 75, "#f5ecd7");

  // Kayaks.
  label("KAYAKS", 115, 145);

  ["#dc8a47", "#c5ae4b", "#718ea0"].forEach(function (color, i) {
    const y = 175 + i * 35;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(115, y, 75, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    rectangle(99, y - 5, 32, 10, "#393d3c");
  });

  // Climbing gear.
  label("CLIMBING GEAR", 340, 145);
  rectangle(250, 160, 180, 80, "#9a896f");

  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = ["#ba704e", "#718ea0"][i % 2];
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(275 + i * 43, 190, 12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "#e9bd70";
    ctx.lineWidth = 3;
    ctx.strokeRect(267 + i * 43, 215, 14, 18);
  }

  // Display bikes.
  label("BIKES", 640, 145);
  drawBike(600, 210, "#718ea0");
  drawBike(720, 210, "#c68e77");

  if (player.y < ashley.y) {
    drawPlayer();
  }

  // Ashley and the new bikes.
  drawAshley(ashley.x, ashley.y);
  label("Ashley ♥", ashley.x, ashley.y - 90, "#843a46");

  rectangle(ashley.x - 42, ashley.y - 40, 30, 8, "#dca574");
  rectangle(ashley.x + 12, ashley.y - 40, 30, 8, "#dca574");

  drawBike(ashley.x - 70, ashley.y + 8, "#718ea0");
  drawBike(ashley.x + 70, ashley.y + 8, "#c68e77");

  if (player.y >= ashley.y) {
    drawPlayer();
  }
}

// ---------- MOUNTAIN TRAILS ----------

function drawFoodTrail() {
  // Koobideh trail.
  rectangle(50, 300, 330, 30, "#c7b58b");
  label("KOOBIDEH", 180, 280);

  for (let i = 0; i < 8; i++) {
    const x = 70 + (i % 4) * 65;
    const y = 350 + Math.floor(i / 4) * 35;

    rectangle(x, y, 49, 3, "#c4c7bd");
    rectangle(x + 4, y - 4, 36, 10, "#8b4c2c");

    for (let ridge = 0; ridge < 4; ridge++) {
      rectangle(x + 8 + ridge * 8, y - 4, 2, 10, "#66361e");
    }
  }

  // Pumpkin cheesecake trail.
  rectangle(420, 300, 330, 30, "#c7b58b");
  label("PUMPKIN CHEESECAKE", 610, 280);

  rectangle(570, 355, 90, 12, "#76513a");
  rectangle(570, 328, 90, 27, "#d88e44");
  rectangle(570, 322, 90, 6, "#f5ecd7");
  rectangle(606, 310, 18, 12, "#f5ecd7");
}

function drawMountainRide() {
  rectangle(0, 0, 800, 480, "#b9d4cf");

  const offset = rideProgress * 110;

  for (let i = -1; i < 6; i++) {
    const x = i * 230 - (offset % 230);
    drawMountain(x, 270, 260, 175, "#82998a");
  }

  rectangle(0, 270, 800, 210, "#839466");
  rectangle(0, 350, 800, 55, "#c7b58b");

  if (!riding) {
    drawFoodTrail();
  }

  drawPlayer();
  drawBike(player.x, player.y + 7, "#718ea0");

  drawAshley(player.x + 90, player.y + 15);
  drawBike(player.x + 90, player.y + 22, "#c68e77");
}

// ---------- DRAW CURRENT SCENE ----------

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (location === "outside") {
    drawOutside();
  } else if (location === "forecast") {
    drawForecast();
  } else if (location === "mecRoute") {
    drawMecRoute();
  } else if (location === "mecInside") {
    drawMecInside();
  } else if (location === "mountains") {
    drawMountainRide();
  }

  let status = "Talk to the stranger.";

  if (location === "outside" && forecastUnlocked) {
    status = "Enter Forecast.";
  }

  if (location === "forecast") {
    status = "Talk to the barista.";

    if (hasCoffee) {
      status = "Find the seat by the outlets on the right.";
    }

    if (coding) {
      status = "Omid is solving every last project problem…";
    }
  }

  if (location === "mecRoute") {
    status = reachedMec
      ? "Ashley is waiting inside MEC!"
      : "Ashley has a surprise! Running to MEC!";
  }

  if (location === "mecInside") {
    status = "Find Ashley and her two brand-new bikes.";
  }

  if (location === "mountains") {
    status = riding
      ? "Into the mountains together!"
      : "Which delicious trail will you choose?";

    if (foodChosen) {
      status = "The koobideh adventure continues!";
    }
  }

  rectangle(0, 0, 800, 30, "#25291f");
  label(status, 400, 21, "#f5ecd7");

  const interaction = getInteraction();

  if (interaction && !talking) {
    rectangle(220, 440, 360, 30, "#25291f");
    label(interaction.prompt, 400, 461, "#f5ecd7");
  }
}

// ---------- GAME LOOP ----------

function gameLoop(time) {
  const seconds = lastTime === null
    ? 0
    : Math.min((time - lastTime) / 1000, 0.05);

  lastTime = time;

  if (runningToMec && !talking) {
    player.x = Math.min(717, player.x + 300 * seconds);

    if (player.x >= 717) {
      runningToMec = false;
      reachedMec = true;
      keys.clear();
      showDialogueForMec();
    }
  } else if (riding && !talking) {
    rideProgress += seconds;

    if (rideProgress >= 6) {
      riding = false;
      showConversation("foodCrossroads");
    }
  } else if (
    !talking &&
    !coding &&
    !phoneOpen &&
    ["outside", "forecast", "mecInside"].includes(location)
  ) {
    let dx = 0;
    let dy = 0;

    if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
    if (keys.has("arrowright") || keys.has("d")) dx += 1;
    if (keys.has("arrowup") || keys.has("w")) dy -= 1;
    if (keys.has("arrowdown") || keys.has("s")) dy += 1;

    const length = Math.hypot(dx, dy);

    if (length > 0) {
      player.x += dx / length * player.speed * seconds;
      player.y += dy / length * player.speed * seconds;
    }

    player.x = Math.max(30, Math.min(770, player.x));
    player.y = Math.max(100, Math.min(430, player.y));
  }

  draw();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
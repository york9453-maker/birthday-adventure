import { conversations } from "./story.js";
import { openBirthdayPhone } from "./phone.js";

// =====================================================
// SETUP
// =====================================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

const dialogue = document.getElementById("dialogue");
const speaker = document.getElementById("speaker");
const dialogueText = document.getElementById("dialogueText");
const choices = document.getElementById("choices");

const playerImage = new Image();
playerImage.src = "./player.png";

const ashleyImage = new Image();
ashleyImage.src = "./ashley.png";

const player = {
  x: 120,
  y: 320,
  speed: 180
};

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

let kayaking = false;
let kayakProgress = 0;

let paragliding = false;
let paraglideProgress = 0;

let birthdaySparkles = 0;


// =====================================================
// DIALOGUE
// =====================================================

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


// =====================================================
// ACTIONS
// =====================================================

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

    window.setTimeout(function () {
      location = "coastLookout";
      showConversation("coastLookout");
    }, 700);
  },

  startKayaking() {
    location = "kayak";

    kayaking = true;
    kayakProgress = 0;

    closeDialogue();
  },

  startMountainAdventure() {
    location = "summit";

    closeDialogue();

    window.setTimeout(function () {
      showConversation("mountainTrail");
    }, 500);
  },

  startParagliding() {
    location = "paragliding";

    paragliding = true;
    paraglideProgress = 0;

    closeDialogue();
  },

  enterOmidHome() {
    location = "omidHome";

    closeDialogue();

    window.setTimeout(function () {
      showConversation("omidLandHome");
    }, 400);
  },

  openBirthdayPresent() {
    location = "birthdayFinale";

    birthdaySparkles = 0;

    closeDialogue();

    window.setTimeout(function () {
      showConversation("birthdayFinale");
    }, 350);
  }
};


// =====================================================
// CONVERSATIONS
// =====================================================

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
      } else if (
        choice.action &&
        typeof actions[choice.action] === "function"
      ) {
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


// =====================================================
// INTERACTIONS
// =====================================================

function near(target, distance = 75) {
  return Math.hypot(
    player.x - target.x,
    player.y - target.y
  ) < distance;
}

function getInteraction() {
  if (
    coding ||
    phoneOpen ||
    runningToMec ||
    riding ||
    kayaking ||
    paragliding
  ) {
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

  if (
    location === "mountains" ||
    location === "mecRoute" ||
    location === "coastLookout" ||
    location === "kayak" ||
    location === "summit" ||
    location === "paragliding" ||
    location === "omidLand" ||
    location === "omidHome" ||
    location === "birthdayFinale"
  ) {
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


// =====================================================
// KEYBOARD
// =====================================================

document.addEventListener("keydown", function (event) {
  const key = event.key.toLowerCase();

  if (phoneOpen) {
    return;
  }

  const controls = [
    "arrowup",
    "arrowdown",
    "arrowleft",
    "arrowright",
    "w",
    "a",
    "s",
    "d",
    "e"
  ];

  if (controls.includes(key)) {
    event.preventDefault();
  }

  if (
    talking ||
    coding ||
    runningToMec ||
    riding ||
    kayaking ||
    paragliding
  ) {
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


// =====================================================
// DRAWING HELPERS
// =====================================================

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
  drawPlayerAt(player.x, player.y, 90);
}

function drawPlayerAt(x, y, height = 90) {
  if (
    playerImage.complete &&
    playerImage.naturalWidth > 0
  ) {
    const width =
      height *
      playerImage.naturalWidth /
      playerImage.naturalHeight;

    ctx.drawImage(
      playerImage,
      x - width / 2,
      y - height,
      width,
      height
    );
  } else {
    drawPerson({ x, y }, "#657343");
  }
}

function drawAshley(x, y, height = 90) {
  if (
    ashleyImage.complete &&
    ashleyImage.naturalWidth > 0
  ) {
    const width =
      height *
      ashleyImage.naturalWidth /
      ashleyImage.naturalHeight;

    ctx.drawImage(
      ashleyImage,
      x - width / 2,
      y - height,
      width,
      height
    );
  } else {
    drawPerson({ x, y }, "#c68e77");
  }
}


// =====================================================
// BIKE
// =====================================================

function drawBike(x, y, color) {
  ctx.strokeStyle = "#25291f";
  ctx.lineWidth = 3;

  ctx.beginPath();

  ctx.arc(
    x - 23,
    y,
    16,
    0,
    Math.PI * 2
  );

  ctx.moveTo(
    x + 39,
    y
  );

  ctx.arc(
    x + 23,
    y,
    16,
    0,
    Math.PI * 2
  );

  ctx.stroke();

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

  rectangle(
    x - 13,
    y - 32,
    16,
    4,
    "#25291f"
  );

  rectangle(
    x + 9,
    y - 39,
    17,
    4,
    "#25291f"
  );
}

function drawBikeWithKayak(
  x,
  y,
  bikeColor,
  kayakColor
) {
  drawBike(x, y, bikeColor);

  // Rear rack
  rectangle(
    x - 35,
    y - 46,
    70,
    4,
    "#25291f"
  );

  // Sea kayak strapped horizontally
  ctx.fillStyle = kayakColor;

  ctx.beginPath();

  ctx.ellipse(
    x,
    y - 62,
    72,
    11,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();

  // Kayak cockpit
  ctx.fillStyle = "#393d3c";

  ctx.beginPath();

  ctx.ellipse(
    x,
    y - 62,
    15,
    6,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();

  // Straps
  rectangle(
    x - 27,
    y - 73,
    4,
    22,
    "#403d38"
  );

  rectangle(
    x + 23,
    y - 73,
    4,
    22,
    "#403d38"
  );
}


// =====================================================
// MOUNTAINS
// =====================================================

function drawMountain(
  x,
  y,
  width,
  height,
  color
) {
  ctx.fillStyle = color;

  ctx.beginPath();

  ctx.moveTo(x, y);
  ctx.lineTo(x + width / 2, y - height);
  ctx.lineTo(x + width, y);

  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#f5ecd7";

  ctx.beginPath();

  ctx.moveTo(
    x + width / 2,
    y - height
  );

  ctx.lineTo(
    x + width / 2 - 20,
    y - height + 35
  );

  ctx.lineTo(
    x + width / 2 + 20,
    y - height + 35
  );

  ctx.closePath();
  ctx.fill();
}


// =====================================================
// KAYAK
// =====================================================

function drawKayak(x, y, color) {
  ctx.fillStyle = color;

  ctx.beginPath();

  ctx.ellipse(
    x,
    y,
    62,
    13,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();

  rectangle(
    x - 17,
    y - 7,
    34,
    10,
    "#25291f"
  );

  ctx.strokeStyle = "#e6d3a8";
  ctx.lineWidth = 4;

  ctx.beginPath();

  ctx.moveTo(
    x - 33,
    y - 28
  );

  ctx.lineTo(
    x + 33,
    y + 28
  );

  ctx.stroke();
}

function drawWhale(x, waterY, jump) {
  const y = waterY - jump;

  ctx.fillStyle = "#50697a";

  ctx.beginPath();

  ctx.ellipse(
    x,
    y,
    48,
    23,
    -0.15,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.beginPath();

  ctx.moveTo(
    x + 38,
    y - 2
  );

  ctx.lineTo(
    x + 70,
    y - 27
  );

  ctx.lineTo(
    x + 60,
    y + 4
  );

  ctx.lineTo(
    x + 75,
    y + 25
  );

  ctx.closePath();
  ctx.fill();

  rectangle(
    x - 30,
    y - 9,
    5,
    5,
    "#f5ecd7"
  );

  if (jump > 20) {
    label(
      "SPLASH!",
      x,
      waterY + 28,
      "#f5ecd7"
    );
  }
}


// =====================================================
// GOATS
// =====================================================

function drawGoat(x, y) {
  rectangle(
    x - 18,
    y - 20,
    36,
    20,
    "#e7e1d2"
  );

  rectangle(
    x + 12,
    y - 31,
    18,
    18,
    "#e7e1d2"
  );

  rectangle(
    x - 13,
    y,
    5,
    18,
    "#403d38"
  );

  rectangle(
    x + 9,
    y,
    5,
    18,
    "#403d38"
  );

  ctx.strokeStyle = "#6d624f";
  ctx.lineWidth = 3;

  ctx.beginPath();

  ctx.moveTo(
    x + 18,
    y - 31
  );

  ctx.lineTo(
    x + 12,
    y - 43
  );

  ctx.moveTo(
    x + 25,
    y - 31
  );

  ctx.lineTo(
    x + 30,
    y - 43
  );

  ctx.stroke();
}


// =====================================================
// PARAGLIDER
// =====================================================

function drawParaglider(x, y, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    42,
    Math.PI,
    Math.PI * 2
  );

  ctx.stroke();

  ctx.strokeStyle = "#403d38";
  ctx.lineWidth = 2;

  ctx.beginPath();

  ctx.moveTo(
    x - 35,
    y
  );

  ctx.lineTo(
    x,
    y + 48
  );

  ctx.moveTo(
    x + 35,
    y
  );

  ctx.lineTo(
    x,
    y + 48
  );

  ctx.stroke();

  rectangle(
    x - 5,
    y + 45,
    10,
    18,
    "#25291f"
  );
}


// =====================================================
// OMID LAND HELPERS
// =====================================================

function drawComputerDesk(x, y) {
  rectangle(
    x - 48,
    y,
    96,
    10,
    "#76563f"
  );

  rectangle(
    x - 42,
    y + 10,
    7,
    42,
    "#493626"
  );

  rectangle(
    x + 35,
    y + 10,
    7,
    42,
    "#493626"
  );

  rectangle(
    x - 28,
    y - 47,
    56,
    38,
    "#30363b"
  );

  rectangle(
    x - 23,
    y - 42,
    46,
    28,
    "#8cc1b0"
  );

  rectangle(
    x - 5,
    y - 9,
    10,
    9,
    "#30363b"
  );

  rectangle(
    x - 22,
    y + 15,
    44,
    5,
    "#d0c5ad"
  );
}

function drawPlant(x, y, scale = 1) {
  ctx.strokeStyle = "#355b37";
  ctx.lineWidth = 4 * scale;

  ctx.beginPath();

  ctx.moveTo(x, y);
  ctx.lineTo(
    x,
    y - 42 * scale
  );

  ctx.stroke();

  ctx.fillStyle = "#4f7d4c";

  const leaves = [
    [-14, -31],
    [14, -38],
    [-18, -48],
    [16, -57],
    [0, -67]
  ];

  leaves.forEach(function (leaf) {
    ctx.beginPath();

    ctx.ellipse(
      x + leaf[0] * scale,
      y + leaf[1] * scale,
      12 * scale,
      6 * scale,
      leaf[0] < 0 ? -0.45 : 0.45,
      0,
      Math.PI * 2
    );

    ctx.fill();
  });

  rectangle(
    x - 14 * scale,
    y,
    28 * scale,
    18 * scale,
    "#b7835a"
  );
}


// =====================================================
// OUTSIDE FORECAST
// =====================================================

function drawOutside() {
  rectangle(
    0,
    0,
    800,
    480,
    "#839466"
  );

  rectangle(
    0,
    280,
    800,
    100,
    "#c7b58b"
  );

  rectangle(
    510,
    180,
    100,
    200,
    "#c7b58b"
  );

  rectangle(
    560,
    180,
    220,
    55,
    "#c7b58b"
  );

  rectangle(
    680,
    80,
    100,
    100,
    "#b7835a"
  );

  rectangle(
    672,
    65,
    116,
    20,
    "#654735"
  );

  rectangle(
    715,
    135,
    30,
    45,
    forecastUnlocked
      ? "#e9bd70"
      : "#403d38"
  );

  label(
    "Forecast",
    730,
    115,
    "#f5ecd7"
  );

  label(
    "Stranger",
    stranger.x,
    stranger.y - 85
  );

  if (player.y < stranger.y) {
    drawPlayer();
    drawPerson(stranger, "#a7664e");
  } else {
    drawPerson(stranger, "#a7664e");
    drawPlayer();
  }
}


// =====================================================
// FORECAST
// =====================================================

function drawForecast() {
  rectangle(
    0,
    0,
    800,
    480,
    "#c5aa83"
  );

  rectangle(
    0,
    0,
    800,
    90,
    "#676f50"
  );

  label(
    "FORECAST",
    400,
    55,
    "#f5ecd7"
  );

  for (
    let y = 100;
    y < 480;
    y += 40
  ) {
    rectangle(
      0,
      y,
      800,
      2,
      "#b59a73"
    );
  }

  rectangle(
    100,
    110,
    350,
    35,
    "#654735"
  );

  drawPerson(
    barista,
    "#a7664e"
  );

  rectangle(
    100,
    175,
    350,
    45,
    "#8c674c"
  );

  label(
    "Barista",
    barista.x,
    105,
    "#f5ecd7"
  );

  rectangle(
    130,
    125,
    65,
    42,
    "#393d3c"
  );

  rectangle(
    140,
    135,
    45,
    15,
    "#b5b9b2"
  );

  rectangle(
    763,
    150,
    25,
    40,
    "#f5ecd7"
  );

  rectangle(
    768,
    160,
    4,
    6,
    "#403d38"
  );

  rectangle(
    779,
    160,
    4,
    6,
    "#403d38"
  );

  rectangle(
    768,
    175,
    4,
    6,
    "#403d38"
  );

  rectangle(
    779,
    175,
    4,
    6,
    "#403d38"
  );

  label(
    "Outlets",
    720,
    135
  );

  rectangle(
    675,
    225,
    30,
    35,
    "#657343"
  );

  drawPlayer();

  rectangle(
    630,
    265,
    120,
    50,
    "#76563f"
  );

  rectangle(
    640,
    315,
    8,
    30,
    "#493626"
  );

  rectangle(
    732,
    315,
    8,
    30,
    "#493626"
  );

  if (coding) {
    rectangle(
      660,
      244,
      55,
      35,
      "#30363b"
    );

    rectangle(
      665,
      249,
      45,
      25,
      "#18232a"
    );

    rectangle(
      655,
      279,
      65,
      6,
      "#a0a5a7"
    );

    rectangle(
      669,
      253,
      23,
      2,
      "#94c789"
    );

    rectangle(
      674,
      259,
      29,
      2,
      "#e9bd70"
    );

    rectangle(
      674,
      265,
      20,
      2,
      "#94c789"
    );

    rectangle(
      730,
      270,
      12,
      14,
      "#f5ecd7"
    );

    ctx.strokeStyle = "#403d38";
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(
      715,
      278
    );

    ctx.lineTo(
      775,
      278
    );

    ctx.lineTo(
      775,
      185
    );

    ctx.stroke();
  }
}


// =====================================================
// MEC ROUTE
// =====================================================

function drawMecRoute() {
  rectangle(
    0,
    0,
    800,
    480,
    "#839466"
  );

  rectangle(
    0,
    280,
    800,
    100,
    "#c7b58b"
  );

  rectangle(
    640,
    130,
    145,
    180,
    "#687361"
  );

  rectangle(
    630,
    115,
    165,
    25,
    "#394c3d"
  );

  label(
    "MEC",
    713,
    170,
    "#f5ecd7"
  );

  rectangle(
    655,
    190,
    40,
    45,
    "#bad4d5"
  );

  rectangle(
    735,
    190,
    35,
    45,
    "#bad4d5"
  );

  rectangle(
    700,
    245,
    35,
    65,
    "#e9bd70"
  );

  rectangle(
    690,
    310,
    55,
    70,
    "#c7b58b"
  );

  drawPlayer();

  if (heartEyes) {
    label(
      "♥ ♥",
      player.x,
      player.y - 65,
      "#ee5574"
    );
  }
}


// =====================================================
// MEC INSIDE
// =====================================================

function drawMecInside() {
  rectangle(
    0,
    0,
    800,
    480,
    "#d0c5ad"
  );

  rectangle(
    0,
    30,
    800,
    80,
    "#536b50"
  );

  label(
    "MEC — ADVENTURE STARTS HERE",
    400,
    75,
    "#f5ecd7"
  );

  label(
    "KAYAKS",
    115,
    145
  );

  [
    "#dc8a47",
    "#c5ae4b",
    "#718ea0"
  ].forEach(function (color, i) {
    const y =
      175 +
      i * 35;

    ctx.fillStyle = color;

    ctx.beginPath();

    ctx.ellipse(
      115,
      y,
      75,
      12,
      0,
      0,
      Math.PI * 2
    );

    ctx.fill();

    rectangle(
      99,
      y - 5,
      32,
      10,
      "#393d3c"
    );
  });

  label(
    "CLIMBING GEAR",
    340,
    145
  );

  rectangle(
    250,
    160,
    180,
    80,
    "#9a896f"
  );

  for (
    let i = 0;
    i < 4;
    i++
  ) {
    ctx.strokeStyle =
      [
        "#ba704e",
        "#718ea0"
      ][i % 2];

    ctx.lineWidth = 5;

    ctx.beginPath();

    ctx.arc(
      275 + i * 43,
      190,
      12,
      0,
      Math.PI * 2
    );

    ctx.stroke();

    ctx.strokeStyle = "#e9bd70";
    ctx.lineWidth = 3;

    ctx.strokeRect(
      267 + i * 43,
      215,
      14,
      18
    );
  }

  label(
    "BIKES",
    640,
    145
  );

  drawBike(
    600,
    210,
    "#718ea0"
  );

  drawBike(
    720,
    210,
    "#c68e77"
  );

  if (player.y < ashley.y) {
    drawPlayer();
  }

  drawAshley(
    ashley.x,
    ashley.y
  );

  label(
    "Ashley ♥",
    ashley.x,
    ashley.y - 115,
    "#843a46"
  );

  drawBike(
    ashley.x - 70,
    ashley.y + 8,
    "#718ea0"
  );

  drawBike(
    ashley.x + 70,
    ashley.y + 8,
    "#c68e77"
  );

  if (player.y >= ashley.y) {
    drawPlayer();
  }
}


// =====================================================
// FOOD TRAIL
// =====================================================

function drawFoodTrail() {
  rectangle(
    50,
    300,
    330,
    30,
    "#c7b58b"
  );

  label(
    "KOOBIDEH",
    180,
    280
  );

  for (
    let i = 0;
    i < 8;
    i++
  ) {
    const x =
      70 +
      (i % 4) * 65;

    const y =
      350 +
      Math.floor(i / 4) * 35;

    rectangle(
      x,
      y,
      49,
      3,
      "#c4c7bd"
    );

    rectangle(
      x + 4,
      y - 4,
      36,
      10,
      "#8b4c2c"
    );

    for (
      let ridge = 0;
      ridge < 4;
      ridge++
    ) {
      rectangle(
        x + 8 +
        ridge * 8,
        y - 4,
        2,
        10,
        "#66361e"
      );
    }
  }

  rectangle(
    420,
    300,
    330,
    30,
    "#c7b58b"
  );

  label(
    "PUMPKIN CHEESECAKE",
    610,
    280
  );

  rectangle(
    570,
    355,
    90,
    12,
    "#76513a"
  );

  rectangle(
    570,
    328,
    90,
    27,
    "#d88e44"
  );

  rectangle(
    570,
    322,
    90,
    6,
    "#f5ecd7"
  );

  rectangle(
    606,
    310,
    18,
    12,
    "#f5ecd7"
  );
}


// =====================================================
// BIKE RIDE
// =====================================================

function drawMountainRide() {
  rectangle(
    0,
    0,
    800,
    480,
    "#b9d4cf"
  );

  const offset =
    rideProgress * 110;

  for (
    let i = -1;
    i < 6;
    i++
  ) {
    const x =
      i * 230 -
      (offset % 230);

    drawMountain(
      x,
      270,
      260,
      175,
      "#82998a"
    );
  }

  rectangle(
    0,
    270,
    800,
    210,
    "#839466"
  );

  rectangle(
    0,
    350,
    800,
    55,
    "#c7b58b"
  );

  if (!riding) {
    drawFoodTrail();
  }

  drawPlayer();

  drawBike(
    player.x,
    player.y + 7,
    "#718ea0"
  );

  drawAshley(
    player.x + 90,
    player.y + 15
  );

  drawBike(
    player.x + 90,
    player.y + 22,
    "#c68e77"
  );
}


// =====================================================
// COASTAL LOOKOUT
// =====================================================

function drawCoastLookout() {
  // Sky
  rectangle(
    0,
    0,
    800,
    480,
    "#9dd5e2"
  );

  // Distant mountains
  drawMountain(
    -40,
    240,
    300,
    145,
    "#728c82"
  );

  drawMountain(
    180,
    240,
    350,
    190,
    "#637d73"
  );

  drawMountain(
    480,
    240,
    340,
    160,
    "#82998a"
  );

  // Ocean
  rectangle(
    0,
    235,
    800,
    150,
    "#4d95ae"
  );

  for (
    let i = 0;
    i < 8;
    i++
  ) {
    label(
      "~",
      60 + i * 100,
      275 +
      (i % 2) * 35,
      "#d9f4f5"
    );
  }

  // Lookout ground
  rectangle(
    0,
    385,
    800,
    95,
    "#75835f"
  );

  // Bikes + kayaks
  drawBikeWithKayak(
    245,
    410,
    "#718ea0",
    "#dc8a47"
  );

  drawBikeWithKayak(
    555,
    410,
    "#c68e77",
    "#718ea0"
  );

  // Omid and Ashley sitting on bikes
  drawPlayerAt(
    245,
    378,
    74
  );

  drawAshley(
    555,
    378,
    74
  );

  label(
    "Omid",
    245,
    455,
    "#f5ecd7"
  );

  label(
    "Ashley",
    555,
    455,
    "#f5ecd7"
  );

  label(
    "COASTAL LOOKOUT",
    400,
    65,
    "#25291f"
  );

  label(
    "Bikes + kayaks + ocean ❤️",
    400,
    95,
    "#25291f"
  );
}


// =====================================================
// SEA KAYAKING
// =====================================================

function drawKayakAdventure() {
  rectangle(
    0,
    0,
    800,
    480,
    "#9dd5e2"
  );

  drawMountain(
    0,
    210,
    280,
    145,
    "#728c82"
  );

  drawMountain(
    190,
    210,
    330,
    190,
    "#637d73"
  );

  drawMountain(
    470,
    210,
    330,
    155,
    "#82998a"
  );

  rectangle(
    0,
    210,
    800,
    270,
    "#4d95ae"
  );

  for (
    let i = 0;
    i < 7;
    i++
  ) {
    const waveX =
      (
        i * 140 +
        kayakProgress * 45
      ) % 900 - 70;

    label(
      "~",
      waveX,
      300 +
      (i % 2) * 65,
      "#d9f4f5"
    );
  }

  const bob =
    Math.sin(
      kayakProgress * 4
    ) * 4;

  drawKayak(
    315,
    355 + bob,
    "#718ea0"
  );

  drawPlayerAt(
    315,
    342 + bob,
    63
  );

  drawKayak(
    505,
    382 - bob,
    "#c68e77"
  );

  drawAshley(
    505,
    367 - bob,
    63
  );

  const whaleJump1 =
    Math.max(
      0,
      Math.sin(
        (kayakProgress - 1.4) *
        1.7
      )
    ) * 105;

  const whaleJump2 =
    Math.max(
      0,
      Math.sin(
        (kayakProgress - 4) *
        1.5
      )
    ) * 90;

  if (
    kayakProgress > 1.2
  ) {
    drawWhale(
      150,
      300,
      whaleJump1
    );
  }

  if (
    kayakProgress > 3.7
  ) {
    drawWhale(
      665,
      330,
      whaleJump2
    );
  }

  label(
    "OMID FLIP COUNT: 0 😎",
    315,
    425,
    "#f5ecd7"
  );
}


// =====================================================
// MOUNTAIN + GOATS
// =====================================================

function drawSummitAdventure() {
  rectangle(
    0,
    0,
    800,
    480,
    "#9ccad1"
  );

  drawMountain(
    -80,
    345,
    430,
    270,
    "#657f74"
  );

  drawMountain(
    210,
    345,
    420,
    300,
    "#728c82"
  );

  drawMountain(
    500,
    345,
    380,
    240,
    "#82998a"
  );

  rectangle(
    0,
    345,
    800,
    135,
    "#75835f"
  );

  drawGoat(
    145,
    325
  );

  drawGoat(
    610,
    305
  );

  drawGoat(
    700,
    345
  );

  drawPlayerAt(
    350,
    350,
    86
  );

  drawAshley(
    430,
    350,
    86
  );

  label(
    "THE MOUNTAINS ⛰",
    400,
    70,
    "#f5ecd7"
  );

  label(
    "The mountain goats approve.",
    400,
    105,
    "#f5ecd7"
  );

  drawParaglider(
    95,
    175,
    "#718ea0"
  );

  drawParaglider(
    705,
    170,
    "#c68e77"
  );
}


// =====================================================
// PARAGLIDING
// =====================================================

function drawParaglidingAdventure() {
  rectangle(
    0,
    0,
    800,
    480,
    "#9dd5e2"
  );

  const shift =
    paraglideProgress * 55;

  drawMountain(
    -90 -
    (shift % 220),
    430,
    330,
    220,
    "#71877d"
  );

  drawMountain(
    180 -
    (shift % 220),
    430,
    330,
    275,
    "#657f74"
  );

  drawMountain(
    470 -
    (shift % 220),
    430,
    360,
    235,
    "#82998a"
  );

  rectangle(
    0,
    410,
    800,
    70,
    "#4d95ae"
  );

  drawParaglider(
    290,
    155 +
    Math.sin(
      paraglideProgress * 2
    ) * 12,
    "#718ea0"
  );

  drawParaglider(
    500,
    205 +
    Math.sin(
      paraglideProgress * 2 + 1
    ) * 12,
    "#c68e77"
  );

  label(
    "Omid",
    290,
    235,
    "#25291f"
  );

  label(
    "Ashley",
    500,
    285,
    "#25291f"
  );

  if (
    paraglideProgress > 3.4
  ) {
    rectangle(
      635,
      370,
      130,
      40,
      "#73955c"
    );

    drawPlant(
      675,
      368,
      0.6
    );

    drawPlant(
      730,
      368,
      0.6
    );

    label(
      "OMID LAND?",
      700,
      335,
      "#25291f"
    );
  }
}


// =====================================================
// OMID LAND
// =====================================================

function drawOmidLand() {
  rectangle(
    0,
    0,
    800,
    480,
    "#9dd5e2"
  );

  rectangle(
    0,
    330,
    800,
    150,
    "#6f9a5d"
  );

  rectangle(
    0,
    430,
    800,
    50,
    "#e8d8a9"
  );

  drawMountain(
    -50,
    330,
    340,
    210,
    "#71877d"
  );

  drawMountain(
    510,
    330,
    330,
    190,
    "#82998a"
  );

  label(
    "✨ WELCOME TO OMID LAND ✨",
    400,
    55,
    "#25291f"
  );

  drawPlant(
    90,
    395,
    0.95
  );

  drawPlant(
    190,
    400,
    0.7
  );

  drawPlant(
    610,
    400,
    0.85
  );

  drawPlant(
    730,
    397,
    1.05
  );

  drawComputerDesk(
    285,
    345
  );

  drawComputerDesk(
    500,
    345
  );

  rectangle(
    360,
    312,
    80,
    32,
    "#76563f"
  );

  rectangle(
    375,
    281,
    50,
    31,
    "#393d3c"
  );

  label(
    "☕",
    400,
    305,
    "#f5ecd7"
  );

  drawPlayerAt(
    355,
    430,
    80
  );

  drawAshley(
    445,
    430,
    80
  );

  label(
    "PLANTS + COMPUTERS + COFFEE",
    400,
    100,
    "#355b37"
  );

  label(
    "No unnecessary meetings.",
    400,
    125,
    "#355b37"
  );
}


// =====================================================
// OMID LAND HOUSE
// =====================================================

function drawOmidHome() {
  rectangle(
    0,
    0,
    800,
    480,
    "#efe3ca"
  );

  rectangle(
    0,
    355,
    800,
    125,
    "#9b8062"
  );

  rectangle(
    70,
    70,
    260,
    170,
    "#badde3"
  );

  rectangle(
    70,
    188,
    260,
    52,
    "#4d95ae"
  );

  rectangle(
    194,
    70,
    12,
    170,
    "#654735"
  );

  rectangle(
    70,
    145,
    260,
    10,
    "#654735"
  );

  drawPlant(
    675,
    337,
    1.1
  );

  drawComputerDesk(
    560,
    320
  );

  // Couch
  rectangle(
    170,
    300,
    300,
    80,
    "#657343"
  );

  rectangle(
    145,
    320,
    35,
    80,
    "#52613b"
  );

  rectangle(
    460,
    320,
    35,
    80,
    "#52613b"
  );

  rectangle(
    180,
    375,
    15,
    38,
    "#493626"
  );

  rectangle(
    445,
    375,
    15,
    38,
    "#493626"
  );

  drawPlayerAt(
    270,
    350,
    72
  );

  drawAshley(
    375,
    350,
    72
  );

  // Present
  rectangle(
    410,
    270,
    52,
    42,
    "#c68e77"
  );

  rectangle(
    433,
    266,
    7,
    50,
    "#e9bd70"
  );

  rectangle(
    406,
    286,
    60,
    7,
    "#e9bd70"
  );

  label(
    "🎁",
    436,
    260,
    "#25291f"
  );
}


// =====================================================
// BIRTHDAY FINALE
// =====================================================

function drawBirthdayFinale() {
  rectangle(
    0,
    0,
    800,
    480,
    "#f5ecd7"
  );

  birthdaySparkles += 0.03;

  const icons = [
    "🎉",
    "❤️",
    "🎂",
    "✨",
    "🏔",
    "🐋",
    "🐐",
    "💻",
    "🌿",
    "🪂"
  ];

  for (
    let i = 0;
    i < 24;
    i++
  ) {
    const x =
      (
        i * 97 +
        birthdaySparkles *
        (
          20 +
          (i % 4) * 8
        )
      ) % 850 - 25;

    const y =
      65 +
      (i * 67) % 360;

    ctx.font = "24px sans-serif";
    ctx.textAlign = "center";

    ctx.fillText(
      icons[
        i %
        icons.length
      ],
      x,
      y
    );
  }

  rectangle(
    120,
    145,
    560,
    190,
    "#25291f"
  );

  label(
    "HAPPY BIRTHDAY",
    400,
    215,
    "#e9bd70"
  );

  ctx.fillStyle = "#f5ecd7";
  ctx.font = "bold 46px monospace";
  ctx.textAlign = "center";

  ctx.fillText(
    "OMID!",
    400,
    275
  );

  label(
    "❤️ from Ashley",
    400,
    315,
    "#ee9a9a"
  );
}


// =====================================================
// DRAW
// =====================================================

function draw() {
  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

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
  } else if (location === "coastLookout") {
    drawCoastLookout();
  } else if (location === "kayak") {
    drawKayakAdventure();
  } else if (location === "summit") {
    drawSummitAdventure();
  } else if (location === "paragliding") {
    drawParaglidingAdventure();
  } else if (location === "omidLand") {
    drawOmidLand();
  } else if (location === "omidHome") {
    drawOmidHome();
  } else if (location === "birthdayFinale") {
    drawBirthdayFinale();
  }

  // ---------------------------------------------------
  // STATUS BAR
  // ---------------------------------------------------

  let status =
    "Talk to the stranger.";

  if (
    location === "outside" &&
    forecastUnlocked
  ) {
    status =
      "Enter Forecast.";
  }

  if (location === "forecast") {
    status =
      "Talk to the barista.";

    if (hasCoffee) {
      status =
        "Find the seat by the outlets on the right.";
    }

    if (coding) {
      status =
        "Omid is solving every last project problem…";
    }
  }

  if (location === "mecRoute") {
    status =
      reachedMec
        ? "Ashley is waiting inside MEC!"
        : "Ashley has a surprise! Running to MEC!";
  }

  if (location === "mecInside") {
    status =
      "Find Ashley and her two brand-new bikes.";
  }

  if (location === "mountains") {
    status =
      riding
        ? "Into the mountains together!"
        : "Which delicious trail will you choose?";

    if (foodChosen) {
      status =
        "The koobideh adventure continues!";
    }
  }

  if (location === "coastLookout") {
    status =
      "Bikes, sea kayaks, mountains, and ocean ❤️";
  }

  if (location === "kayak") {
    status =
      kayaking
        ? "Sea kayaking with Ashley — Omid is still upright!"
        : "Adventure on the ocean.";
  }

  if (location === "summit") {
    status =
      "Mountain goats, huge views, and a suspiciously convenient paraglider…";
  }

  if (location === "paragliding") {
    status =
      "Flying toward a mysterious island…";
  }

  if (location === "omidLand") {
    status =
      "Welcome to Omid Land: plants, computers, coffee, paradise.";
  }

  if (location === "omidHome") {
    status =
      "One last birthday surprise…";
  }

  if (location === "birthdayFinale") {
    status =
      "HAPPY BIRTHDAY OMID! ❤️";
  }

  rectangle(
    0,
    0,
    800,
    30,
    "#25291f"
  );

  label(
    status,
    400,
    21,
    "#f5ecd7"
  );

  const interaction =
    getInteraction();

  if (
    interaction &&
    !talking
  ) {
    rectangle(
      220,
      440,
      360,
      30,
      "#25291f"
    );

    label(
      interaction.prompt,
      400,
      461,
      "#f5ecd7"
    );
  }
}


// =====================================================
// GAME LOOP
// =====================================================

function gameLoop(time) {
  const seconds =
    lastTime === null
      ? 0
      : Math.min(
          (time - lastTime) / 1000,
          0.05
        );

  lastTime = time;

  // ---------------------------------------------------
  // RUN TO MEC
  // ---------------------------------------------------

  if (
    runningToMec &&
    !talking
  ) {
    player.x =
      Math.min(
        717,
        player.x +
        300 * seconds
      );

    if (
      player.x >= 717
    ) {
      runningToMec = false;
      reachedMec = true;

      keys.clear();

      showDialogueForMec();
    }
  }

  // ---------------------------------------------------
  // BIKE RIDE
  // ---------------------------------------------------

  else if (
    riding &&
    !talking
  ) {
    rideProgress += seconds;

    if (
      rideProgress >= 6
    ) {
      riding = false;

      showConversation(
        "foodCrossroads"
      );
    }
  }

  // ---------------------------------------------------
  // SEA KAYAKING
  // ---------------------------------------------------

  else if (
    kayaking &&
    !talking
  ) {
    kayakProgress += seconds;

    if (
      kayakProgress >= 7.5
    ) {
      kayaking = false;

      showConversation(
        "kayakWhales"
      );
    }
  }

  // ---------------------------------------------------
  // PARAGLIDING
  // ---------------------------------------------------

  else if (
    paragliding &&
    !talking
  ) {
    paraglideProgress += seconds;

    if (
      paraglideProgress >= 7
    ) {
      paragliding = false;

      location = "omidLand";

      showConversation(
        "omidLandArrival"
      );
    }
  }

  // ---------------------------------------------------
  // NORMAL WALKING
  // ---------------------------------------------------

  else if (
    !talking &&
    !coding &&
    !phoneOpen &&
    [
      "outside",
      "forecast",
      "mecInside"
    ].includes(location)
  ) {
    let dx = 0;
    let dy = 0;

    if (
      keys.has("arrowleft") ||
      keys.has("a")
    ) {
      dx -= 1;
    }

    if (
      keys.has("arrowright") ||
      keys.has("d")
    ) {
      dx += 1;
    }

    if (
      keys.has("arrowup") ||
      keys.has("w")
    ) {
      dy -= 1;
    }

    if (
      keys.has("arrowdown") ||
      keys.has("s")
    ) {
      dy += 1;
    }

    const length =
      Math.hypot(
        dx,
        dy
      );

    if (length > 0) {
      player.x +=
        (
          dx /
          length
        ) *
        player.speed *
        seconds;

      player.y +=
        (
          dy /
          length
        ) *
        player.speed *
        seconds;
    }

    player.x =
      Math.max(
        30,
        Math.min(
          770,
          player.x
        )
      );

    player.y =
      Math.max(
        100,
        Math.min(
          430,
          player.y
        )
      );
  }

  draw();

  requestAnimationFrame(
    gameLoop
  );
}

requestAnimationFrame(
  gameLoop
);
export const conversations = {
  stranger: {
    speaker: "Mysterious Stranger",
    text: "Salam Omid! Tavalodet mobarak! Boro be Forecast!",
    choices: [
      { text: "Berim Forecast! — Let's go!", next: "directions" },
      { text: "Na ... beram bekhabam 😴", next: "wrongDestination" }
    ]
  },

  wrongDestination: {
    speaker: "Mysterious Stranger",
    text: "Khab?! Emrooz tavalodete! 😂 Maybe give the birthday adventure a chance.",
    choices: [
      { text: "Berim — Okay, let's go!", next: "stranger" }
    ]
  },

  directions: {
    speaker: "Mysterious Stranger",
    text: "Forecast is up the path. Birthday adventure starts there. Khosh begzare!",
    choices: [
      { text: "Berim! 🚶", action: "unlockForecast" }
    ]
  },

  reminder: {
    speaker: "Mysterious Stranger",
    text: "Forecast is just ahead. Berim!",
    choices: [
      { text: "Merci! Keep going", action: "close" }
    ]
  },

  // ---------------------------------------------------
  // FORECAST
  // ---------------------------------------------------

  barista: {
    speaker: "Forecast Barista",
    text: "Salam Omid! Chi mikhay? Flat white, espresso martini, ya poonzdah ta ghahve?",
    choices: [
      { text: "Ye flat white, lotfan ☕", next: "flatWhite" },
      { text: "Espresso martini, lotfan 🍸", next: "martini" },
      { text: "Poonzdah ta ghahve! ☕☕☕", next: "fifteenCoffees" }
    ]
  },

  martini: {
    speaker: "Forecast Barista",
    text: "Espresso martini? Alan?! Before coding? 😂 Maybe one more try.",
    choices: [
      { text: "باشه — Ye flat white maybe...", next: "barista" }
    ]
  },

  fifteenCoffees: {
    speaker: "Forecast Barista",
    text: "Poonzdah ta?! Are you coding an app or trying to see through time?",
    choices: [
      { text: "😂 باشه — Try again", next: "barista" }
    ]
  },

  flatWhite: {
    speaker: "Forecast Barista",
    text: "Hatman! Ye flat white barat dorost mikonam. You spot the perfect seat beside the outlets.",
    choices: [
      { text: "Merci! ☕ Take the coffee", action: "takeCoffee" }
    ]
  },

  coffeeReminder: {
    speaker: "Forecast Barista",
    text: "Nooshe jan! Your laptop and the outlets are waiting for you.",
    choices: [
      { text: "Berim code bezanim 💻", action: "close" }
    ]
  },

  coding: {
    speaker: "Omid",
    text: "You sit down, plug in your laptop, and take a sip of your flat white. Perfect. Time to code.",
    choices: [
      {
        text: "Berim! 💻 Start coding",
        action: "beginCoding"
      }
    ]
  },

  threeHoursLater: {
    speaker: "3 HOURS LATER",
    text:
      "Three hours fly by. Every bug fixed. Every project problem solved. " +
      "Omid leans back, feeling extremely accomplished... then notices his phone has been buzzing nonstop.",
    choices: [
      {
        text: "Bebinam... 📱 Check the phone",
        action: "openPhone"
      }
    ]
  },

  // ---------------------------------------------------
  // MEC
  // ---------------------------------------------------

  ashleyBikes: {
    speaker: "Ashley ❤️",
    text:
      "Salam azizam! Ashley is standing beside two brand-new bikes. " +
      "\"In do ta do-charkhe male maast! What do you think... berim bikepacking?\"",
    choices: [
      {
        text: "Are! Man aasheghe do-charkhe-savaariam! 🚲",
        next: "bikingYes"
      },
      {
        text: "Hmm... do-charkhe-savaari? 🤔",
        next: "bikingNo"
      }
    ]
  },

  bikingNo: {
    speaker: "Ashley",
    text:
      "Ashley laughs. \"Fair enough 😂 But they're pretty nice bikes... maybe one little birthday ride?\" " +
      "Omid looks at the bikes again. Okay... they are VERY nice.",
    choices: [
      {
        text: "Okay, convinced. Berim! 🚲",
        next: "bikingYes"
      }
    ]
  },

  bikingYes: {
    speaker: "Omid",
    text:
      "\"Are! Berim!\" Omid is immediately excited to try the new bike. " +
      "Ashley grabs hers and the two of them head toward the mountains together.",
    choices: [
      {
        text: "Berim too kooh-ha! 🏔️🚲",
        action: "startBikeRide"
      }
    ]
  },

  // ---------------------------------------------------
  // BIKEPACKING + FOOD
  // ---------------------------------------------------

  foodCrossroads: {
    speaker: "A delicious dilemma",
    text:
      "After riding through the mountains, two trails appear. " +
      "One seems to lead toward an unbelievable amount of koobideh. " +
      "The other promises pumpkin cheesecake. Kodoom raah?",
    choices: [
      {
        text: "Koobideh! Berim! 🍢",
        next: "koobideh"
      },
      {
        text: "Cheesecake-e kadoo! 🎃🍰",
        next: "cheesecake"
      }
    ]
  },

  cheesecake: {
    speaker: "Omid",
    text:
      "Omid considers the pumpkin cheesecake... but then smells koobideh somewhere in the distance. " +
      "Okay. This decision suddenly became very easy.",
    choices: [
      {
        text: "😂 Na... koobideh! Bargard!",
        next: "foodCrossroads"
      }
    ]
  },

  koobideh: {
    speaker: "Omid",
    text:
      "\"KOO-BI-DEH?! Bezan berim!\" Omid immediately takes off down the trail toward the smell of grilled koobideh.",
    choices: [
      {
        text: "Berim koobideh bokhorim! 🍢",
        action: "chooseKoobideh"
      }
    ]
  },

  // ---------------------------------------------------
  // COASTAL BIKE LOOKOUT
  // ---------------------------------------------------

  coastLookout: {
    speaker: "Ashley ❤️",
    text:
      "After a very successful koobideh feast, Ashley and Omid keep riding toward the coast. " +
      "They eventually reach a beautiful lookout above the ocean. " +
      "Their bikes sit side by side with sea kayaks sitting on the shore while mountains rise from the water below.",
    choices: [
      {
        text: "Vaaay... cheghadr ghashange 🌊",
        next: "coastLookoutView"
      },
      {
        text: "Berim kayak! 🚣",
        next: "kayakStart"
      }
    ]
  },

  coastLookoutView: {
    speaker: "Omid",
    text:
      "Omid sits on his bike beside Ashley and looks across the water. " +
      "The ocean is calm, the mountains are glowing in the distance, and the kayaks are ready behind them. " +
      "\"In kheili khoobe,\" Omid says. This birthday adventure is turning out pretty great.",
    choices: [
      {
        text: "Ye kam dige inja bemoonim ❤️",
        next: "coastLookoutSweet"
      },
      {
        text: "Okay... berim too ab! 🚣",
        next: "kayakStart"
      }
    ]
  },

  coastLookoutSweet: {
    speaker: "Ashley ❤️",
    text:
      "They stay for another minute, just enjoying the view together. " +
      "Then Omid looks at the sea kayaks. \"Okay... I think I'm ready. Berim?\"",
    choices: [
      {
        text: "Berim! 🌊",
        next: "kayakStart"
      }
    ]
  },

  // ---------------------------------------------------
  // SEA KAYAKING
  // ---------------------------------------------------

  kayakStart: {
    speaker: "Omid",
    text:
      "They carry the kayaks down to the beach and push into the ocean. " +
      "The water is glassy and the mountains surround them. " +
      "Omid settles into his kayak. \"Are... in kheili khoobe.\"",
    choices: [
      {
        text: "Berim jelo! 🚣",
        action: "startKayaking"
      },
      {
        text: "Ye lahze... enjoy the view 🌊",
        next: "kayakRelax"
      }
    ]
  },

  kayakRelax: {
    speaker: "Ashley ❤️",
    text:
      "The two kayaks float quietly beside each other. " +
      "Ashley and Omid take in the mountains and the calm water before continuing farther out.",
    choices: [
      {
        text: "Okay, hala berim! 🚣",
        action: "startKayaking"
      }
    ]
  },

  kayakWhales: {
    speaker: "Ashley ❤️",
    text:
      "Suddenly... SPLASH!!! 🐋 A huge whale launches completely out of the water. " +
      "Then ANOTHER whale jumps nearby. Omid turns around excitedly to look... " +
      "and his kayak starts wobbling.",
    choices: [
      {
        text: "😎 Na na... too kayak bemoon!",
        next: "kayakStayedUpright"
      },
      {
        text: "🌊 Bezan berim too ab! Flip it 😂",
        next: "kayakFlip"
      }
    ]
  },

  kayakFlip: {
    speaker: "Omid",
    text:
      "SPLASH. 😂 Omid flips directly into the ocean. " +
      "He comes back up laughing while Ashley watches from her kayak. " +
      "Apparently that was one way to celebrate seeing whales.",
    choices: [
      {
        text: "😂 Dobare! This time stay upright",
        next: "kayakWhales"
      }
    ]
  },

  kayakStayedUpright: {
    speaker: "Omid",
    text:
      "The kayak wobbles... wobbles again... and then settles. " +
      "\"YES!\" Omid laughs. He stayed completely upright while two whales jumped beside them. " +
      "An objectively excellent kayaking performance.",
    choices: [
      {
        text: "Aali bood! 😎 Keep paddling",
        next: "kayakMountainView"
      }
    ]
  },

  kayakMountainView: {
    speaker: "Ashley ❤️",
    text:
      "They paddle farther along the coast. Ahead of them, a huge mountain rises directly from the shoreline. " +
      "Omid looks up at the summit. Ashley notices him staring at it. " +
      "\"That looks pretty amazing... mikhay berim bala?\"",
    choices: [
      {
        text: "Are! Berim bala! 🏔️",
        action: "startMountainAdventure"
      },
      {
        text: "Ye kam dige kayak konim 🚣",
        next: "keepKayaking"
      }
    ]
  },

  keepKayaking: {
    speaker: "Omid",
    text:
      "They keep kayaking for a while longer, enjoying the whales and the coastline. " +
      "Eventually Omid looks back toward the mountain. " +
      "\"Okay... actually, I really want to see the view from up there.\"",
    choices: [
      {
        text: "Berim kooh! 🥾🏔️",
        action: "startMountainAdventure"
      }
    ]
  },

  // ---------------------------------------------------
  // MOUNTAIN ADVENTURE
  // ---------------------------------------------------

  mountainTrail: {
    speaker: "Omid",
    text:
      "They pull the kayaks onto the beach and start hiking. " +
      "The trail climbs through forest, past waterfalls, and eventually into rocky alpine terrain. " +
      "Every time Omid looks back, the ocean view gets better.",
    choices: [
      {
        text: "Berim bala! 🥾",
        next: "mountainGoats"
      },
      {
        text: "Ye break bokhorim 😅",
        next: "mountainBreak"
      }
    ]
  },

  mountainBreak: {
    speaker: "Ashley ❤️",
    text:
      "Ashley and Omid stop on a rock overlooking the ocean, drink some water, and enjoy the view. " +
      "After a few minutes, Omid looks toward the summit again. \"Okay. Berim.\"",
    choices: [
      {
        text: "Berim! ⛰️",
        next: "mountainGoats"
      }
    ]
  },

  mountainGoats: {
    speaker: "Omid",
    text:
      "Higher in the alpine, something moves across the rocks. MOUNTAIN GOATS! 🐐 " +
      "A whole group is standing on the ridge. Omid immediately stops. " +
      "\"Vaaay! Look at them!\"",
    choices: [
      {
        text: "Salam boz-ha! 🐐 Keep hiking",
        next: "goatApproval"
      },
      {
        text: "🐐 Bebin koja miran — Follow them",
        next: "followGoats"
      }
    ]
  },

  followGoats: {
    speaker: "Omid",
    text:
      "Omid follows them for approximately ten seconds before one goat casually walks straight up a cliff. " +
      "\"Okay... maybe we don't follow that route.\" 😂",
    choices: [
      {
        text: "😂 Bargard be trail",
        next: "mountainGoats"
      }
    ]
  },

  goatApproval: {
    speaker: "Mountain Goat Council 🐐",
    text:
      "The goats stand calmly beside the trail as Ashley and Omid hike past. " +
      "Omid decides this clearly means the Mountain Goat Council has approved the expedition.",
    choices: [
      {
        text: "Merci boz-ha 😂 Berim summit!",
        next: "summitReached"
      }
    ]
  },

  summitReached: {
    speaker: "Omid",
    text:
      "They reach the summit. The view is incredible: snowy mountains, turquoise ocean, " +
      "and tiny green islands stretching into the distance. " +
      "Omid walks around looking at everything before noticing two paragliders nearby. " +
      "\"Wait... can we actually fly from here?\"",
    choices: [
      {
        text: "Are! Berim paragliding! 🪂",
        action: "startParagliding"
      },
      {
        text: "Ye kam az manzare lezzat ببریم ⛰️",
        next: "summitView"
      }
    ]
  },

  summitView: {
    speaker: "Ashley ❤️",
    text:
      "Ashley and Omid sit together on the summit for a while, looking down at the ocean they had just kayaked across. " +
      "Eventually Omid looks back at the paragliders and grins. \"Okay... hala berim paragliding.\"",
    choices: [
      {
        text: "Bezan berim! 🪂",
        action: "startParagliding"
      }
    ]
  },

  // ---------------------------------------------------
  // OMID LAND
  // ---------------------------------------------------

  omidLandArrival: {
    speaker: "Omid",
    text:
      "They launch from the mountain and glide above the ocean. " +
      "After flying past the coastline, Omid notices a beautiful green island below. " +
      "They land softly on the beach beside a wooden sign: ✨ WELCOME TO OMID LAND ✨. " +
      "\"Omid Land?!\"",
    choices: [
      {
        text: "Vaaay 😂 Berim begardim! 🌴",
        next: "omidLandChoice"
      },
      {
        text: "Inja chie?! Look around 👀",
        next: "omidLandChoice"
      }
    ]
  },

  omidLandChoice: {
    speaker: "OMID LAND 🌿💻",
    text:
      "The island seems suspiciously perfect for Omid. " +
      "Huge tropical plants cover the hills, beautiful computer setups sit among the trees, " +
      "there are outlets everywhere, and somebody has somehow installed extremely fast Wi-Fi.",
    choices: [
      {
        text: "اول computer-ha! 💻",
        next: "omidComputers"
      },
      {
        text: "اول giaah-ha! 🌿",
        next: "omidPlants"
      }
    ]
  },

  omidComputers: {
    speaker: "Omid",
    text:
      "The computer setup is ridiculous. Perfect monitors, perfect keyboards, comfortable chairs, " +
      "fast internet, and a fresh flat white beside every desk. " +
      "\"Okay... I understand Omid Land now.\"",
    choices: [
      {
        text: "Kheili khoobe 😂 Explore more",
        next: "omidLandExplore"
      }
    ]
  },

  omidPlants: {
    speaker: "Ashley ❤️",
    text:
      "They wander through enormous tropical plants and flowers along little trails overlooking the ocean. " +
      "Omid notices that there are somehow computer desks hidden between the plants too.",
    choices: [
      {
        text: "Perfect 😂 Berim baghie-sho ببینیم",
        next: "omidLandExplore"
      }
    ]
  },

  omidLandExplore: {
    speaker: "Omid",
    text:
      "After exploring, Omid has reached a conclusion: Omid Land is excellent. " +
      "Plants, computers, mountains, ocean, great coffee, unlimited outlets, and zero unnecessary meetings. " +
      "Then they notice a cozy little house overlooking the water.",
    choices: [
      {
        text: "Berim too! 🏡",
        action: "enterOmidHome"
      }
    ]
  },

  // ---------------------------------------------------
  // BIRTHDAY ENDING
  // ---------------------------------------------------

  omidLandHome: {
    speaker: "Ashley ❤️",
    text:
      "Inside is a huge comfortable couch beside a window overlooking the ocean. " +
      "Plants fill the room and there is, naturally, another very nice computer setup nearby. " +
      "Ashley and Omid sit down together after the long adventure.",
    choices: [
      {
        text: "Kheili khoob bood ❤️",
        next: "birthdayPackage"
      },
      {
        text: "Ye kam esterahat 😴",
        next: "couchNap"
      }
    ]
  },

  couchNap: {
    speaker: "Omid",
    text:
      "Omid sinks into the couch. Honestly... after biking, kayaking, hiking, and paragliding, this feels amazing. " +
      "After a minute, Ashley smiles and reaches behind the couch. \"Before you get TOO comfortable...\"",
    choices: [
      {
        text: "Hmm? What is it?",
        next: "birthdayPackage"
      }
    ]
  },

  birthdayPackage: {
    speaker: "Ashley ❤️",
    text:
      "Ashley pulls out a package and hands it to Omid. 🎁 " +
      "\"Ye chize dige ham barat daram. Tavalodet mobarak, azizam.\"",
    choices: [
      {
        text: "Vaaay ❤️ Open it!",
        action: "openBirthdayPresent"
      },
      {
        text: "Shake the package",
        next: "shakePackage"
      }
    ]
  },

  shakePackage: {
    speaker: "Ashley",
    text:
      "Omid gives the package one little shake. Ashley laughs. \"Omid! Bazesh kon! 😂\"",
    choices: [
      {
        text: "باشه باشه 😂 Bazesh kon!",
        action: "openBirthdayPresent"
      }
    ]
  },

  birthdayFinale: {
    speaker: "Ashley ❤️",
    text:
      "HAPPY BIRTHDAY OMID! 🎂❤️ From coffee and coding, to bikepacking and koobideh, " +
      "to kayaking, climbing mountains, " +
      "and one day discovering Omid Land — I hope this year is full of adventures you love, " +
      "lots of laughs, great coffee, exciting projects, beautiful places, and so many good memories. I am so grateful you are a part of my life " +
      "Tavalodet mobarak, azizam, nafasam, jigaram, khoshteepam! Dooset daram ye donya ❤️",
    choices: [
      {
        text: "❤️ Tavalod mobarak! — THE END",
        action: "close"
      }
    ]
  }
};
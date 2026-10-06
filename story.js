export const conversations = {
  stranger: {
    speaker: "Mysterious Stranger",
    text: "Salam Omid! Tavalodet mobarak! Boro be Forecast!",
    choices: [
      { text: "Go to Forecast", next: "directions" },
      { text: "Go back to bed", next: "wrongDestination" }
    ]
  },

  wrongDestination: {
    speaker: "Mysterious Stranger",
    text: "That birthday plan sounds mahi mahi… Try again!",
    choices: [
      { text: "← Back / Try again", next: "stranger" }
    ]
  },

  directions: {
    speaker: "Mysterious Stranger",
    text: "Forecast is up the path. Your birthday mission starts there!",
    choices: [
      { text: "Berim! — Let's go!", action: "unlockForecast" }
    ]
  },

  reminder: {
    speaker: "Mysterious Stranger",
    text: "Head to Forecast. They're waiting for you!",
    choices: [
      { text: "Keep walking", action: "close" }
    ]
  },

  barista: {
    speaker: "Forecast Barista",
    text: "Salam Omid! Chi mikhay? Flat white, espresso martini, ya poonzdah ta ghahve?",
    choices: [
      { text: "Ye flat white, lotfan.", next: "flatWhite" },
      { text: "Ye espresso martini, lotfan.", next: "martini" },
      { text: "Poonzdah ta ghahve, lotfan!", next: "fifteenCoffees" }
    ]
  },

  martini: {
    speaker: "Forecast Barista",
    text: "An espresso martini? Before coding? Let's try that order again.",
    choices: [
      { text: "← Back / Try again", next: "barista" }
    ]
  },

  fifteenCoffees: {
    speaker: "Forecast Barista",
    text: "Fifteen coffees?! Are you coding an app or trying to see through time?",
    choices: [
      { text: "← Back / Try again", next: "barista" }
    ]
  },

  flatWhite: {
    speaker: "Forecast Barista",
    text: "Hatman! Ye flat white barat dorost mikonam. You spot a seat beside the outlets on the right.",
    choices: [
      { text: "Take the flat white", action: "takeCoffee" }
    ]
  },

  coffeeReminder: {
    speaker: "Forecast Barista",
    text: "Enjoy your flat white! Your laptop and the outlets are waiting on the right.",
    choices: [
      { text: "Find a seat", action: "close" }
    ]
  },

    coding: {
    speaker: "Omid",
    text: "You sit down, plug in your laptop, and take a sip of your flat white. Time to code…",
    choices: [
      {
        text: "Begin coding 💻",
        action: "beginCoding"
      }
    ]
  },

  threeHoursLater: {
    speaker: "3 HOURS LATER",
    text: "Three hours fly by. Every bug fixed. Every project problem solved. Omid leans back triumphantly… then notices his phone has been buzzing nonstop!",
    choices: [
      {
        text: "Check your phone 📱",
        action: "openPhone"
      }
    ]
  }
  ,

  ashleyBikes: {
    speaker: "Ashley ❤️",
    text: "Salam azizam! In do ta do-charkhe-ye no male maast! Berim bikepacking!",
    choices: [
      {
        text: "Man aasheghe do-charkhe-savaariam!",
        next: "bikingYes"
      },
      {
        text: "Man az do-charkhe-savaari badam miad!",
        next: "bikingNo"
      }
    ]
  },

  bikingNo: {
    speaker: "Ashley",
    text: "Vaghean?! Pas in do ta do-charkhe ro chi kar konam? 😂",
    choices: [
      {
        text: "← Bargard — Try again",
        next: "ashleyBikes"
      }
    ]
  },

  bikingYes: {
    speaker: "Ashley ❤️",
    text: "Manam! Berim too kooh-ha! Your brand-new bikes are ready for their first adventure.",
    choices: [
      {
        text: "Berim! 🚲",
        action: "startBikeRide"
      }
    ]
  },

  foodCrossroads: {
    speaker: "A delicious dilemma",
    text: "Two mountain trails appear. One leads to mountains of koobideh. The other leads to pumpkin cheesecake. Kodoom raah ro entekhaab mikoni?",
    choices: [
      {
        text: "Berim koobideh bokhorim!",
        next: "koobideh"
      },
      {
        text: "Berim cheesecake-e kadoo bokhorim!",
        next: "cheesecake"
      }
    ]
  },

  cheesecake: {
    speaker: "Ashley ❤️",
    text: "To shirin-tarin doos-pesari, vali emrooz rooze toe! ❤️",
    choices: [
      {
        text: "← Bargard — Choose again",
        next: "foodCrossroads"
      }
    ]
  },

  koobideh: {
    speaker: "Omid",
    text: "Koobideh?! Bezan berim! You follow the trail toward an unbelievable feast.",
    choices: [
      {
        text: "Follow the koobideh trail",
        action: "chooseKoobideh"
      }
    ]
  }
};
export function openBirthdayPhone(onRunToMec) {
  const overlay = document.createElement("div");

  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    background: "rgba(0, 0, 0, 0.85)",
    display: "grid",
    placeItems: "center",
    zIndex: "1000",
    padding: "16px",
    overflowY: "auto"
  });

  const phone = document.createElement("section");

  Object.assign(phone.style, {
    boxSizing: "border-box",
    width: "100%",
    maxWidth: "390px",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#f5ecd7",
    color: "#25291f",
    border: "8px solid #25291f",
    borderRadius: "24px",
    padding: "20px",
    textAlign: "left",
    boxShadow: "0 0 0 3px #e9bd70"
  });

  overlay.appendChild(phone);
  document.body.appendChild(overlay);

  function heading(text) {
    const title = document.createElement("h2");
    title.textContent = text;
    phone.appendChild(title);
  }

  function paragraph(text) {
    const element = document.createElement("p");
    element.textContent = text;
    element.style.lineHeight = "1.6";
    phone.appendChild(element);
    return element;
  }

  function button(text, action) {
    const element = document.createElement("button");
    element.textContent = text;
    element.onclick = action;
    element.style.marginTop = "16px";
    phone.appendChild(element);
    return element;
  }

  function showInbox() {
    phone.replaceChildren();

    heading("📱 Birthday notifications");
    paragraph("Your phone has been blowing up!");

    const messages = [
      {
        name: "Shayan",
        text: "تولدت مبارک امید جان! 🎉"
      },
      {
        name: "Tina",
        text: "امید جان، تولدت مبارک! امیدوارم روز فوق‌العاده‌ای داشته باشی! 🎂"
      },
      {
        name: "Amir",
        text: "تولدت مبارک رفیق! همیشه شاد و سلامت باشی! 🥳"
      },
      {
        name: "Aida",
        text: "تولدت مبارک امید! سال جدید زندگیت پر از شادی باشه! ✨"
      },
      {
        name: "Amir Watermelon 🍉",
        text: "تولدت مبارک امید جان! امروز نوبت کیکه، نه هندونه! 🍉🎂"
      }
    ];

    messages.forEach(function (message) {
      const card = document.createElement("div");

      Object.assign(card.style, {
        padding: "12px",
        marginBottom: "10px",
        background: "#e4dcc9",
        borderRadius: "10px"
      });

      const name = document.createElement("strong");
      name.textContent = message.name;

      const text = document.createElement("p");
      text.textContent = message.text;
      text.lang = "fa";
      text.dir = "rtl";
      text.style.fontFamily = "Arial, sans-serif";
      text.style.lineHeight = "1.7";
      text.style.marginBottom = "0";

      card.append(name, text);
      phone.appendChild(card);
    });

    button("💌 New message from Ashley", showAshley);
  }

  function showAshley() {
    phone.replaceChildren();

    heading("Ashley ❤️");

    const bubble = paragraph(
      "Tavalodet mobarak, azizam! ❤️ " +
      "Ye soorpriz barat daram! " +
      "Mitoonam alan too MEC bebinamet? 😘"
    );

    Object.assign(bubble.style, {
      background: "#dce6ce",
      padding: "18px",
      borderRadius: "14px",
      fontSize: "20px"
    });

    paragraph("Omid reads the message. His eyes turn into hearts.");

    const reaction = paragraph("😍");
    reaction.style.fontSize = "64px";
    reaction.style.textAlign = "center";

    button("😍 Run to MEC!", function () {
      overlay.remove();
      onRunToMec();
    });
  }

  showInbox();
}
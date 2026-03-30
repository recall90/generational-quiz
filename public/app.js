const questions = [
  "Katera generacija si?",
  "Kako komuniciraš?",
  "Kako poslušaš glasbo?",
  "Kako spremljaš novice?",
  "Kaj ti pomeni cloud?",
  "Kako gledaš serije?",
  "Socialna omrežja?",
  "Nova tehnologija?",
  "Prvi internet?",
  "Kaj ti pomeni delo?",
  "Nakupovanje?",
  "Humor?",
  "Organizacija časa?",
  "Učenje?",
  "Kaj te opisuje?"
];

const labels = [
  ["Gen Z","Millennials","Gen X","Boomers"],
  ["DM","Messenger","SMS","Klic"],
  ["Streaming","YouTube","MP3","Radio"],
  ["TikTok","Portali","TV+splet","TV"],
  ["Samoumevno","Uporabno","Zmedeno","Ne uporabljam"],
  ["Streaming","Netflix","Download","TV"],
  ["Stalno","Pogosto","Občasno","Redko"],
  ["Takoj","Kasneje","Skeptično","Ne zanima"],
  ["Od malega","V šoli","Kasneje","Pozno"],
  ["Fleksibilnost","Ravnotežje","Stabilnost","Dolžnost"],
  ["Online","Večinoma online","Kombinacija","Trgovina"],
  ["Memi","Ironija","Situacijski","Klasičen"],
  ["Aplikacije","Digitalno","Kombinacija","Papir"],
  ["TikTok","Online tečaji","Knjige+splet","Knjige"],
  ["Spremembe","Ambicija","Stabilnost","Tradicija"]
];

const values = ["genZ","millennials","genX","boomers"];

const form = document.getElementById("quiz");

questions.forEach((q, i) => {
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `<p><b>${q}</b></p>`;

  values.forEach((val, j) => {
    div.innerHTML += `
      <label>
        <input type="radio" name="q${i}" value="${val}">
        ${labels[i][j]}
      </label><br>
    `;
  });

  form.appendChild(div);
});

async function submitQuiz() {
  const answers = [];

  for (let i = 0; i < questions.length; i++) {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (!selected) {
      alert("Odgovori na vsa vprašanja!");
      return;
    }
    answers.push(selected.value);
  }

  const res = await fetch("/api/submit", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ answers })
  });

  const data = await res.json();

  let text = "Tvoja generacija: " + data.result;

  if (data.mixed) {
    text += " (mešano z " + data.mixed + ")";
  }

  document.getElementById("result").innerText = text;
}
let results = [];

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const { answers } = req.body;

  let score = {
    genZ: 0,
    millennials: 0,
    genX: 0,
    boomers: 0
  };

  answers.forEach(a => {
    score[a] += 2;
  });

  score[answers[0]] += 1;

  const sorted = Object.entries(score).sort((a,b) => b[1]-a[1]);

  const result = sorted[0][0];
  const second = sorted[1][0];

  const isMixed = sorted[0][1] - sorted[1][1] <= 2;

  results.push(score);

  res.json({
    result,
    mixed: isMixed ? second : null,
    score
  });
}
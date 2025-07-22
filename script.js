let questions = [];
let score = 0;

fetch('question.json')
  .then(res => res.json())
  .then(data => {
    questions = data;
    loadQuiz();
  });

function loadQuiz() {
  const form = document.getElementById('quizForm');
  questions.forEach((q, i) => {
    const div = document.createElement('div');
    div.innerHTML = `<p><strong>${i + 1}. ${q.question}</strong></p>`;
    q.options.forEach(opt => {
      div.innerHTML += `<label><input type="radio" name="q${i}" value="${opt}"/> ${opt}</label><br>`;
    });
    form.appendChild(div);
  });
}

function submitQuiz() {
  const name = document.getElementById("username").value;
  if (!name) return alert("Please enter your name");

  questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected && selected.value === q.answer) score++;
  });

  const responses = JSON.parse(localStorage.getItem("quizResponses") || "[]");
  responses.push({ name: name, score: score, date: new Date().toLocaleString() });
  localStorage.setItem("quizResponses", JSON.stringify(responses));

  generateCertificate(name, score);
}

function generateCertificate(name, score) {
  const certContainer = document.createElement('div');
  certContainer.style.position = "relative";
  certContainer.style.width = "1086px";
  certContainer.style.height = "768px";
  certContainer.style.backgroundImage = "url('background.png')";
  certContainer.style.backgroundSize = "cover";
  certContainer.style.fontFamily = "Georgia, serif";

  const nameDiv = document.createElement('div');
  nameDiv.style.position = "absolute";
  nameDiv.style.top = "340px";
  nameDiv.style.left = "0";
  nameDiv.style.right = "0";
  nameDiv.style.textAlign = "center";
  nameDiv.style.fontSize = "28px";
  nameDiv.style.fontWeight = "bold";
  nameDiv.innerText = name;
  certContainer.appendChild(nameDiv);

  const scoreDiv = document.createElement('div');
  scoreDiv.style.position = "absolute";
  scoreDiv.style.top = "400px";
  scoreDiv.style.left = "0";
  scoreDiv.style.right = "0";
  scoreDiv.style.textAlign = "center";
  scoreDiv.style.fontSize = "20px";
  scoreDiv.innerText = `Score: ${score} / ${questions.length}`;
  certContainer.appendChild(scoreDiv);

  html2pdf()
    .from(certContainer)
    .set({
      margin: 0,
      filename: `${name}_Certificate.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'px', format: [1086, 768], orientation: 'landscape' }
    })
    .save();
}
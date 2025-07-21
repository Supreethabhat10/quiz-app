
let questions = [];
let userAnswers = [];

window.onload = function () {
  fetch("quiz.json")
    .then((res) => res.json())
    .then((data) => {
      questions = data;
      loadQuiz();
    });
};

function loadQuiz() {
  const quizContainer = document.getElementById("quiz-container");
  quizContainer.innerHTML = "";

  questions.forEach((q, index) => {
    const qDiv = document.createElement("div");
    qDiv.innerHTML = `
      <p><strong>${index + 1}. ${q.question}</strong></p>
      ${q.options
        .map(
          (opt) =>
            `<label><input type="radio" name="q${index}" value="${opt}"> ${opt}</label><br>`
        )
        .join("")}
    `;
    quizContainer.appendChild(qDiv);
  });
}

function submitQuiz() {
  const totalQuestions = quizData.length;
  const score = calculateScore(); // Your existing score logic
  const name = document.getElementById("username").value.trim();

  if (!name) {
    alert("Please enter your name.");
    return;
  }

  // Redirect to certificate page with query params
  const redirectUrl = `certificate.html?name=${encodeURIComponent(name)}&score=${score}`;
  window.location.href = redirectUrl;
  }

  let score = 0;

  questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const answer = selected ? selected.value : "";
    if (answer === q.answer) {
      score++;
    }
  });

  showCertificate(username, score);
}

function showCertificate(name, score) {
  const cert = document.getElementById("certificate");
  cert.classList.remove("hidden");
  cert.innerHTML = `
    <div class="certificate">
      <h2>Certificate of Completion</h2>
      <p>This is to certify that</p>
      <h3>${name}</h3>
      <p>has successfully completed the quiz with a score of</p>
      <h3>${score} / ${questions.length}</h3>
    </div>
  `;
}

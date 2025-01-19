let currentStep = 0;
let userName = "";
let userEmail = "";
let testAnswers = [];
let awaitingConfirmation = false;
const questions = [
    {
        text: "Eu gosto de passar tempo sozinha(o).",
        options: ["Discordo totalmente", "Discordo", "Neutro", "Concordo", "Concordo totalmente"],
        scores: [-2, -1, 0, 1, 2]
    },
    {
        text: "Eu sou uma pessoa muito sociável.",
        options: ["Discordo totalmente", "Discordo", "Neutro", "Concordo", "Concordo totalmente"],
        scores: [-2, -1, 0, 1, 2]
    },
    {
        text: "Eu frequentemente fico perdida(o) em pensamentos.",
        options: ["Discordo totalmente", "Discordo", "Neutro", "Concordo", "Concordo totalmente"],
        scores: [-2, -1, 0, 1, 2]
    },
    {
        text: "Eu sou uma pessoa criativa.",
        options: ["Discordo totalmente", "Discordo", "Neutro", "Concordo", "Concordo totalmente"],
        scores: [-2, -1, 0, 1, 2]
    },
    {
        text: "Eu estou sempre preocupada(o)",
        options: ["Discordo totalmente", "Discordo", "Neutro", "Concordo", "Concordo totalmente"],
        scores: [-2, -1, 0, 1, 2]
    },
    {
        text: "Eu me sinto calma(o) em situações estressantes.",
        options: ["Discordo totalmente", "Discordo", "Neutro", "Concordo", "Concordo totalmente"],
        scores: [-2, -1, 0, 1, 2]
    }
];


const radarChartConfig = {
    type: 'radar',
    data: {
        labels: ['Introversão', 'Extroversão', 'Intuição', 'Criatividade', 'Ansiedade', 'Tranquilidade'],
        datasets: [{
            label: 'Traços de Personalidade',
            data: [],
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
        }]
    },
    options: {
        scales: {
            r: {
                min: 0,
                max: 10,
                ticks: {
                    stepSize: 1
                }
            }
        },
        elements: {
            line: {
                borderWidth: 3
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed.r || 0;

                        return `${label}: ${value}`;
                    }
                }
            }
        }
    }
};

function addMessage(message, type) {
    const chatArea = document.getElementById('chat-area');
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add(type);
    chatArea.appendChild(messageElement);
    chatArea.scrollTop = chatArea.scrollHeight;

}


function handleName(name) {
    userName = name;
    addMessage("Qual é o seu e-mail?", 'prompt-message');
    document.getElementById('user-input').placeholder = "Insira seu melhor e-mail aqui";
    currentStep++;
}

function handleEmail(email) {
    if (!validateEmail(email)) {
        addMessage("Hmm, acho que não entendi seu e-mail...", 'prompt-message');
        return;
    }
    userEmail = email;
    addMessage("Perfeito! Você está pronto para iniciar seu teste de personalidade?", 'prompt-message');
    document.getElementById('user-input').placeholder = "Digite 'sim' ou 'estou pronto'";
    awaitingConfirmation = true;
    currentStep++;
}

function handleConfirmation(answer) {
    const answerLower = answer.toLowerCase();
    if (answerLower === "sim" || answerLower === "estou" || answerLower === "estou pronto") {
        addMessage("Então, vamos lá!", 'prompt-message');
        startTest();
        awaitingConfirmation = false;
    } else {
        addMessage('Quando estiver pronto me diga "estou" ', 'prompt-message');
    }
}

function handleTest(selectedOption) {
    if (selectedOption) {
        testAnswers.push(selectedOption);
        const selectedOptionText = questions[currentStep - 4].options[selectedOption];
          addMessage(selectedOptionText, 'user-message');
        if (currentStep - 4 < questions.length - 1) {
             currentStep++;
              loadQuestion();
        } else {
            showResults();
        }
        document.removeEventListener('keypress', handleEnterTest);
    } else {
        addMessage("Por favor, selecione uma das opções abaixo:", 'prompt-message');
    }
}


function startTest() {
    document.getElementById('user-input').classList.add('hidden');
    currentStep = 4;
    loadQuestion();
}

function loadQuestion() {
    document.getElementById('user-input').value = "";
     document.querySelectorAll('.radio-options').forEach(element => element.remove());
    const currentQuestion = questions[currentStep - 4];
    addMessage(`Pergunta ${currentStep - 3} de ${questions.length} \n ${currentQuestion.text}`, 'prompt-message');
    const answerOptionsDiv = document.createElement('div');
    answerOptionsDiv.classList.add('radio-options');
    currentQuestion.options.forEach((option, index) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'answer';
        input.value = index;
        input.id = `option-${index}`;
        input.addEventListener('change', () => {
            handleTest(input.value);
        });
        label.appendChild(input);
        label.append(option);
        answerOptionsDiv.appendChild(label);
    });
    document.getElementById('chat-area').appendChild(answerOptionsDiv);
      document.addEventListener('keypress', handleEnterTest);
    document.getElementById('user-input').classList.add('hidden');
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function calculateScores() {
   const traitScores = [0, 0, 0, 0, 0, 0];
     testAnswers.forEach((answerId, questionIndex) => {
           const answerIndex = parseInt(answerId);
        const score = questions[questionIndex].scores[answerIndex];

        if (questionIndex === 0) {
            traitScores[0] += score;
        }
        else if (questionIndex === 1) {
            traitScores[1] += score;
        }
        else if (questionIndex === 2) {
            traitScores[2] += score;
        }
        else if (questionIndex === 3) {
            traitScores[3] += score;
        }
        else if (questionIndex === 4) {
            traitScores[4] += score;
        }
        else if (questionIndex === 5) {
            traitScores[5] += score;
        }
    });

    // Adjust scores to achieve 10 on "Strongly Agree" for two questions
    if (testAnswers[0] === '4') {
        traitScores[0] += 8;
    }

    if (testAnswers[1] === '4') {
        traitScores[1] += 8;
    }

    if (testAnswers[2] === '4') {
        traitScores[2] += 8;
    }

    if (testAnswers[3] === '4') {
        traitScores[3] += 8;
    }

    if (testAnswers[4] === '4') {
        traitScores[4] += 8;
    }
    if (testAnswers[5] === '4') {
        traitScores[5] += 8;
    }

    for (let i = 0; i < traitScores.length; i++) {
        traitScores[i] = Math.max(0, traitScores[i])
    }
    return traitScores;
}


function showResults() {
     document.getElementById('user-input').classList.remove('hidden');
       document.querySelectorAll('.radio-options').forEach(element => element.remove());
       addMessage(`Pronto ${userName}, aqui está o resultado do seu teste de personalidade`,'prompt-message');
    let scores = calculateScores();
    radarChartConfig.data.datasets[0].data = scores;
    const canvas = document.createElement('canvas');
    document.getElementById('chat-area').appendChild(canvas);
    const ctx = canvas.getContext('2d');
    new Chart(ctx, radarChartConfig);
    const summary = generateSummary(scores);
    addMessage(summary, 'results-message');
      document.getElementById('user-input').placeholder = "Digite 'enviar' para receber o resultado no e-mail";
}


function generateSummary(scores) {
    const introversion = scores[0]
    const extroversion = scores[1];
    const intuition = scores[2];
    const creativity = scores[3];
    const anxiety = scores[4];
    const calm = scores[5];


    let summary = `Baseado nos seus resultados: \n`;
    if (introversion > extroversion) {
        summary += `Você tende a ser uma pessoa mais introvertida, o que significa que provavelmente valoriza momentos de reflexão e prefere ambientes calmos ou atividades individuais para recarregar suas energias.`;
    } else {
        summary += `Você tende a ser uma pessoa mais extrovertida, o que indica que é energizado(a) pela interação social e geralmente se sente confortável em ambientes dinâmicos e cheios de pessoas.`;
    }

    if (intuition > 0) {
        summary += `Além disso, você parece ser uma pessoa intuitiva, confiando mais em padrões e possibilidades abstratas do que nos detalhes imediatos da realidade.`;
    } else {
        summary += `Além disso, você parece valorizar mais a percepção prática e concreta, preferindo lidar com fatos e experiências diretas.`;
    }

    if (creativity > 0) {
        summary += `Sua criatividade é um ponto forte, sugerindo que você tem facilidade para gerar ideias inovadoras e explorar soluções originais para problemas`;
    } else {
        summary += `Sua criatividade pode ser menos evidente no momento, mas isso não significa que você não possa desenvolvê-la por meio de práticas que estimulem o pensamento criativo.`;
    }

    if (anxiety > calm) {
        summary += `Também observamos uma tendência à ansiedade, o que pode significar que você frequentemente se preocupa ou se sente tenso(a) diante de desafios. Trabalhar em estratégias para lidar com o estresse pode ser benéfico para seu bem-estar.`;
    }
    else {
        summary += `Você demonstra uma tendência a permanecer calmo(a) mesmo em situações potencialmente estressantes, o que reflete uma habilidade valiosa para lidar com desafios de forma equilibrada.`;
    }


    return summary;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


function handleEnterTest(event) {
    if (event.key === 'Enter') {
         const selectedOption = document.querySelector('input[name="answer"]:checked');
          if(selectedOption){
              handleTest(selectedOption.value);
         }
    }
}

document.getElementById('user-input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        const userInput = document.getElementById('user-input').value;
          document.getElementById('user-input').value = "";
           document.querySelectorAll('.radio-options').forEach(element => element.remove());
           addMessage(userInput, 'user-message');
        if(currentStep >= 4){
                if(userInput === "enviar"){
                     addMessage(`${userName}, você receberá os resultados em ${userEmail} dentro de alguns minutos.`, 'prompt-message')
                     document.getElementById('user-input').placeholder = "";
                }
                return;
           }
        if (currentStep === 0) {
            handleName(userInput);
        } else if (currentStep === 1) {
            handleEmail(userInput);
        } else if (currentStep === 2 && awaitingConfirmation) {
            handleConfirmation(userInput);
        }
    }
});
addMessage("Bem-vindo(a)! Sou eu, seu teste de personalidade.", 'prompt-message');
addMessage("Para começarmos, como gostaria de ser chamada(o)?", 'prompt-message');

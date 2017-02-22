const letterWrap = document.getElementById('letter-wrapper');
const idWrap = document.getElementById('question-id');
const categoryWrap = document.getElementById('question-category');
const textWrap = document.getElementById('question-text');
const answerWrapper = document.getElementById('answer-wrapper');
const correctNotificationWrap = document.getElementById('notification');
const correctAnswersWrap = document.getElementById('correct-answers');
const totalQuestionsWrap = document.getElementById('total-questions');
const pageWrap = document.getElementById('page');
const skipWrap = document.getElementById('skip');

let controlResultArr = [];
let counterLetter = 0;
let counterAnswers = 0;
let counterQuestions = 0;

function request () {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', 'http://jservice.io/api/random');
  xhr.send();

  xhr.onreadystatechange = function () {
    if (this.readyState !== 4) return;

    if (this.status !== 200) { console.error(this.status, this.statusText); return; }

    render(this.response);
  };
}

function render(response) {
  const data = parseResponse(response);
  
  renderQuestions(data);
  renderAnswer(data.answer, data);
  skipQuestions();

  console.log(data.answer);
}

function parseResponse(response) {
  return JSON.parse(response)[0];
}

function renderAnswer (answer, data) {
  const answerArrOrder = answer.split('');
  const answerArr = shuffle(answerArrOrder);
  
  for (let i = 0, length = answerArr.length; i < length; i++) {
    const divWrap = document.createElement('button');

    divWrap.className = "letter-button";
    divWrap.innerHTML = answerArr[i];
    letterWrap.appendChild(divWrap);
    divWrap.addEventListener("click", ev => moveLetter(ev, divWrap, answer, data));

  }
}

function renderQuestions (data) {
  idWrap.innerHTML = data.id;
  categoryWrap.innerHTML = data.category.title;
  textWrap.innerHTML = data.question;
}

function moveLetter (ev, divWrap, answer) {
  divWrap.answered = !divWrap.answered;
  if (divWrap.answered) {
    divWrap.remove();
    answerWrapper.appendChild(divWrap);
    controlResultArr.push(divWrap);
    counterLetter += 1;
  } else {
    divWrap.remove();
    let index = controlResultArr.findIndex(function (x) {return x === divWrap;});
    controlResultArr.splice(index, index + 1);
    counterLetter -= 1;
    letterWrap.appendChild(divWrap);
  }
  checkAnswer (controlResultArr, counterLetter, answer, divWrap);
}

function answerCounter (ev, correctAnswersWrap, totalQuestionsWrap,  divWrap, nextQuestionsWrap) {
  counterAnswers += 1;
  counterQuestions += 1;
  correctAnswersWrap.innerHTML = counterAnswers;
  totalQuestionsWrap.innerHTML = counterQuestions;
  answerWrapper.innerHTML = '';
  controlResultArr = [];
  nextQuestionsWrap.className = "next-question hidden";
  correctNotificationWrap.className = "result-notification";
  request ();
}

function checkAnswer (controlResultArr, counterLetter, answer, divWrap) {
  if (answer === controlResultArr.map(function(x) {return x.innerHTML;}).join('')) {
    correctNotificationWrap.className = "result-notification correct";
    let nextQuestionsWrap = document.createElement('button');
    
    nextQuestionsWrap.className = "next-question";
    nextQuestionsWrap.innerHTML = 'NEXT QUESTION';
    pageWrap.appendChild(nextQuestionsWrap);

    nextQuestionsWrap.addEventListener("click", ev => answerCounter(ev, correctAnswersWrap, totalQuestionsWrap, divWrap, nextQuestionsWrap));
  } else {
    correctNotificationWrap.className = "result-notification incorrect";
  }
}

function skipQuestions () {
  skipWrap.addEventListener("click", ev); 
}
request (); 

function ev () {
  let nextQuestionsWrap = document.getElementsByClassName('next-question');
  counterQuestions += 1;
  totalQuestionsWrap.innerHTML = counterQuestions;
  answerWrapper.innerHTML = '';
  letterWrap.innerHTML = '';
  controlResultArr = [];
  correctNotificationWrap.className = "result-notification";
  request ();
  nextQuestionsWrap.className = "next-question hidden";
}
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

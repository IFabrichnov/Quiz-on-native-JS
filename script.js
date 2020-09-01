//создание элементов
let currentQuestion = 0;
let result = 0;
const wrapper = document.createElement('div');
const error = document.createElement('p');
wrapper.classList.add('wrapper');
let data = [];

const openJson = () => {
  fetch('./questions.json')
    .then(response => {
      return response.json();
    })
    .then(response => {
      data = response;

      createQuestion();
    });
};

openJson();

const answerHandler = () => {
  let answersAll = document.querySelector('.answers');
  const selector = `input[name=question${currentQuestion}]:checked`;
  const userAnswer = (answersAll.querySelector(selector) || {}).value;

  sendAnswer(userAnswer).then(checkAnswer);

};

//имитация отправки запроса на сервер
const sendAnswer = (value) => {

  return new Promise(resolve => {

    setTimeout(() => {

      if (value == data.questions[currentQuestion].rightAnswerId) {
        resolve(true)
      } else {
        resolve(false)
      }

    }, 2000)
  })
};

//функция then для промиса
const checkAnswer = (resolve) => {
  if (resolve) {
    currentQuestion++;
    result++;
    if (currentQuestion == data.questions.length) {
      document.querySelector('.question').remove();
      document.querySelector('.answers').remove();
      showResult();
    } else {
      createQuestion();
    }
  } else {
    wrongAnswer();
  }
};



const createQuestion = () => {
  //создание инпутов с ответами
  const answersArr = [];
  for (answer in data.questions[currentQuestion].answers) {
    answersArr.push(
      `<label>
            <input type="radio" class="answer-question" onchange="answerHandler()" name="question${currentQuestion}" value="${data.questions[currentQuestion].answers[answer].id}">
             ${data.questions[currentQuestion].answers[answer].text}
        </label>`
    );
  }
  ;

  //создание контейнера с вопросом и ответами
  const questionAndAnswers = [];
  questionAndAnswers.push(
    `<div class="question">
    ${data.questions[currentQuestion].question}</div>
     <div class="answers">
        ${answersArr.join('')} 
    </div>    
    `
  );

  wrapper.innerHTML = questionAndAnswers.join('');
  document.body.append(wrapper);
};


//ошибка
const wrongAnswer = () => {
  error.innerHTML = 'ERROR';
  error.classList.add('red');
  wrapper.appendChild(error);
};

//вывод результата
const showResult = () => {
  const endResult = document.createElement('p');
  endResult.innerHTML = `YOUR RESULT IS = ${result}`;
  endResult.classList.add('win');
  wrapper.appendChild(endResult);
  wrapper.removeChild(error);
};


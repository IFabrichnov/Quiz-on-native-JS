# Квиз (тест) на нативном JS

## Запуск проекта

*Чтобы запустить проект, нужно перейти по ссылке на gh-pages:* [ссылка на проект](https://ifabrichnov.github.io/Quiz-on-native-JS/ "ссылка на проект")

![1](https://github.com/IFabrichnov/Quiz-on-native-JS/raw/master/README-IMG/1.jpg)

## Описание

Отрисовать таблицу, подгрузить в нее данные из json файла. Сымитировать двухсекундное ожидание после нажатие на ответ.

### Что применено

**fetch** - Fetch API работает с запросами и ответами http. Также предоставляет глобальный метод fetch() , который позволяет легко и логично получать ресурсы по сети асинхронно.

Пример базового запроса на получение данных:
```javascript
fetch('http://example.com/movies.json')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
  });
```
Здесь забираем JSON файл по сети и выводим его содержимое в консоль. Самый простой способ использования fetch() заключается в вызове этой функции с одним аргументом — строкой, содержащей путь к ресурсу, который надо получить — которая возвращает promise, содержащее ответ (объект response).

**Применение в задании**

```javascript
const openJson = () => {
  fetch('./questions.json')
    .then(response => {
      return response.json();
    })
    .then(response => {
      data = response;
      console.log(data);

      createQuestion();

    });
};
```

**Promise** - Promise используется для отложенных и асинхронных вычислений. Принимает в себя resolve и reject. Первый аргумент вызывает успешное исполнение промиса, второй отклоняет его. Промис представляет собой обертку для значения, неизвестного на момент создания промиса. Он позволяет обрабатывать результаты асинхронных операций так, как если бы они были синхронными: вместо конечного результата асинхронного метода возвращается обещание (промис) получить результат в некоторый момент в будущем. 

Пример простого промиса:
```javascript
let promise = new Promise((resolve, reject) => {
    setTimeout(() => { resolve(‘’success!’’)}, 250);
});
promise.then((message) => {
//message – любое сообщение, которое передаем в resolve. Может быть не обязательно строка
     console.log(‘’Yep!’’ + message);
});

```


## Пошаговое написание кода

**1.** Создание элементов и полученние данных из файла json

```javascript
let currentQuestion = 0;
let result = 0;
const wrapper = document.createElement('div');
const error = document.createElement('p');
wrapper.classList.add('wrapper');

const openJson = () => {
  fetch('./questions.json')
    .then(response => {
      return response.json();
    })
    .then(response => {
      data = response;
      console.log(data);

      createQuestion();

    });
};
```

**2.** 2)	Создание инпутов с ответами на вопрос. Идет перебор объекта с вопросами по currentQuestion. Далее все вопросы пушатся в массив answerArr в виде html кода. Далее создается контейнер и туда помещаются ответы и вопрос. Аналогичным образом с помощью пуша в массив. В конце помещаю контейнер в wrapper и добавляю wrapper в body.

```javascript
const createQuestion = () => {
  //создание инпутов с ответами
  const answersArr = [];
  for (answer in dataQuiz.questions[currentQuestion].answers) {
    answersArr.push(
      `<label>
            <input type="radio" class="answer-variable" onchange="answerHandler()" name="question${currentQuestion}" value="${dataQuiz.questions[currentQuestion].answers[answer].id}">
             ${dataQuiz.questions[currentQuestion].answers[answer].text}
        </label>`
    );
  };
  //создание контейнеров с вопросом и ответами
  const questionAndAnswers = [];
  questionAndAnswers.push(
    `<div class="question">
    ${dataQuiz.questions[currentQuestion].question}</div>
     <div class="answers">
        ${answersArr.join('')} 
    </div>    
    `
  );

  wrapper.innerHTML = questionAndAnswers.join('');
  document.body.append(wrapper);
};

```

**3.** Создание вспомогательных функций – ошибки, вывод результата.

```javascript
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
  endResult.classList.add('green');
  wrapper.appendChild(endResult);
  wrapper.removeChild(error);
};
```

**4.** Создание хэндлера для инпута. Для начала надо получить значение VALUE инпута по которому кликнули (значение :checked). После получение данного значения, передаю его в sendAnswer, где происходит имитация запроса на сервер, с ответом через 2 секунды. 

```javascript
const answerHandler = () => {
  //получаем значение value инпута
  let answersAll = document.querySelector('.answers');
  const selector = `input[name=question${currentQuestion}]:checked`;
  const userAnswer = (answersAll.querySelector(selector) || {}).value;
  
  //при каждом нажатии на инпут имитируем запрос на сервер
  sendAnswer(userAnswer).then(checkAnswer);
};
```

В sendAnswer создаю Promise который делает имитацию задержки с помощью setTimeout. В setTimeout проверяю, если значение, которое передали в sendAnswer равно правильному ответу currentQuestion, то возвращаю resolver(true) если нет – false. После resolve(true) в методе .then передаю функцию checkAnswer, где выполяется основной функционал.

```javascript
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

const checkAnswer = (resolve) => {
  if (resolve) {
    currentQuestion++;
    result++;
    if (currentQuestion == dataQuiz.questions.length) {
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
```
После правильного ответа, инкременирую currentQuestion, чтобы перейти к следующему вопросу, так же result. Далее проверяю, если текущий вопрос равен количеству вопросов, то убираю вопрос с ответами и отрисовываю showResult. Если условие не выполено, то вызываю createQuestion, где происходит следующая отрисовка вопроса. Если в checkAnswer пришел resolve не true а false, то вызывается wrongAnswer.

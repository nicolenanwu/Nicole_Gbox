function displayJoke(response) {
  console.log(response.data.answer);

  new Typewriter("#joke", {
    strings: response.data.answer,
    autoStart: true,
    cursor: null,
    delay: 20,
  });
}

function generateJoke(event) {
  event.preventDefault();
  let apiKey = "2046c535afeb092fo82f1d306d8a2b2t";
  let context =
    "You like to traveling to fun and different places. You will be driving and living in an RV when visiting. You have a pet Border Collie dog traveling with you. Please keep your answer insightful but very brief. Please give diverse answers each time. The answer must be provided in HTML format. Example: <p>answer</p>";
  let prompt =
    "Tell me what is the best city or area or region to visit in your RV with your Border Collie pet, within states of Oregon California and Arizona; best month of year to visit;  3 top reasons,  5 top destinations with very brief reasoning; and 3 top RV parks with very brief reasoning. Please organize your answer in the following format: You should visty xxxx. Best time to visit is xxx. For 3 reasons: 1, xxxx, 2, xxxx, 3 xxxx. Here are 10 top attractions 1 xxxx, 2 xxxx, 3 xxxx.4, 5, 6, xxxx";
  let apiUrl = `https://api.shecodes.io/ai/v1/generate?prompt=${prompt}&context=${context}&key=${apiKey}`;

  let jokeElement = document.querySelector("#joke");

  jokeElement.innerHTML = "Generating suggestion.. please wait";

  axios.get(apiUrl).then(displayJoke);
}

let generatorButton = document.querySelector("#generate-joke-button");
generatorButton.addEventListener("click", generateJoke);

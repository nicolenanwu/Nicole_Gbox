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
    "You like to traveling to fun cities, and you have been to many places. You have a vacation coming up, and want to know where best to have a good time. The answer must be provided in HTML format. Example: <p>answer</p>";
  let prompt =
    "Tell me what is the best city within the US to visit right now, with 3 top reasons, and 3 top destinations. Please organize your answer in the following format: You should visty xxxx. For 3 reasons: 1, xxxx, 2, xxxx, 3 xxxx. And with 3 top attractions 1 xxxx, 2 xxxx, 3 xxxx.";
  let apiUrl = `https://api.shecodes.io/ai/v1/generate?prompt=${prompt}&context=${context}&key=${apiKey}`;

  let jokeElement = document.querySelector("#joke");

  jokeElement.innerHTML = "Generating suggestion.. please wait";

  console.log("called the AI api");
  axios.get(apiUrl).then(displayJoke);
}

let generatorButton = document.querySelector("#generate-joke-button");
generatorButton.addEventListener("click", generateJoke);

function displayJoke(response) {
  console.log("Raw response:", response);

  const answer = response?.data?.answer || "No answer returned.";

  new Typewriter("#joke", {
    strings: answer,
    autoStart: true,
    cursor: null,
    delay: 20,
  });
}

// simple toggle between 2 topics
let lastTopic = null;

function generateJoke(event) {
  event.preventDefault();

  const apiKey = "2046c535afeb092fo82f1d306d8a2b2t";

  // Decide which topic to ask about
  let topic;
  if (lastTopic === "daily") {
    topic = "product";
  } else {
    topic = "daily";
  }
  lastTopic = topic;

  // Prompts kept short so answers fit your UI
  let prompt;
  if (topic === "daily") {
    prompt =
      "You are an AI coach for a busy product and AI leader who travels often and juggles family, side businesses, and flying. Suggest 5 concrete, practical ways AI tools can help in daily life (time management, email, routines, learning, travel). Use very short phrases, no fluff.";
  } else {
    prompt =
      "You are an AI coach for an experienced product manager working in AI and platforms. Suggest 5 specific ways to apply AI in product management (customer research, roadmap, prioritization, experiments, risk). Use very short phrases, no fluff.";
  }

  const context =
    "Keep answers under 120 words. Return HTML only. Use this format: <p><strong>Topic:</strong> Daily life or Product management.</p><ul><li>Tip 1</li><li>Tip 2</li><li>Tip 3</li><li>Tip 4</li><li>Tip 5</li></ul>";

  const apiUrl = "https://api.shecodes.io/ai/v1/generate";

  const params = {
    prompt,
    context,
    key: apiKey,
  };

  const jokeElement = document.querySelector("#joke");
  if (!jokeElement) {
    console.error("#joke element not found");
    return;
  }

  jokeElement.innerHTML =
    topic === "daily"
      ? "Asking AI for daily-life ideas..."
      : "Asking AI for product management ideas...";

  axios
    .get(apiUrl, { params })
    .then(displayJoke)
    .catch((error) => {
      console.error("API error:", error);
      jokeElement.innerHTML =
        "Sorry, there was an error contacting the AI service.";
    });
}

const generatorButton = document.querySelector("#generate-joke-button");
if (!generatorButton) {
  console.error("#generate-joke-button not found");
} else {
  generatorButton.addEventListener("click", generateJoke);
}

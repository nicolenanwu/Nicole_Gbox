function typewriterInto(selector, text) {
  new Typewriter(selector, {
    strings: text,
    autoStart: true,
    cursor: null,
    delay: 20,
  });
}

function callSheCodesAI({ prompt, context, targetSelector, loadingText }) {
  const apiKey = "2046c535afeb092fo82f1d306d8a2b2t";
  const apiUrl = "https://api.shecodes.io/ai/v1/generate";

  const outputElement = document.querySelector(targetSelector);
  if (!outputElement) {
    console.error("Output element not found:", targetSelector);
    return;
  }

  outputElement.innerHTML = loadingText;

  axios
    .get(apiUrl, {
      params: {
        prompt,
        context,
        key: apiKey,
      },
    })
    .then((response) => {
      console.log("Raw response:", response);
      const answer = response?.data?.answer || "No answer returned.";
      typewriterInto(targetSelector, answer);
    })
    .catch((error) => {
      console.error("API error:", error);
      outputElement.innerHTML =
        "Sorry, there was an error contacting the AI service.";
    });
}

// Daily-life AI button
function onDailyClick(event) {
  event.preventDefault();

  const prompt =
    "You are an AI coach for a busy product and AI leader who travels often and juggles family, side businesses, and flying. Suggest 5 concrete, practical ways AI tools can help in daily life (time management, email, routines, learning, travel). Use very short phrases, no fluff.";

  const context =
    "Keep answers under 120 words. Return HTML only. Use this format: <p><strong>Topic:</strong> Daily life.</p><ul><li>Tip 1</li><li>Tip 2</li><li>Tip 3</li><li>Tip 4</li><li>Tip 5</li></ul>";

  callSheCodesAI({
    prompt,
    context,
    targetSelector: "#daily-ai-output",
    loadingText: "Asking AI for daily-life ideas...",
  });
}

// Product-management AI button
function onPmClick(event) {
  event.preventDefault();

  const prompt =
    "You are an AI coach for an experienced product manager working in AI and platforms. Suggest 5 specific ways to apply AI in product management (customer research, roadmap, prioritization, experiments, risk). Use very short phrases, no fluff.";

  const context =
    "Keep answers under 120 words. Return HTML only. Use this format: <p><strong>Topic:</strong> Product management.</p><ul><li>Tip 1</li><li>Tip 2</li><li>Tip 3</li><li>Tip 4</li><li>Tip 5</li></ul>";

  callSheCodesAI({
    prompt,
    context,
    targetSelector: "#pm-ai-output",
    loadingText: "Asking AI for product management ideas...",
  });
}

// Attach listeners to the two new buttons
const dailyButton = document.querySelector("#daily-ai-button");
if (!dailyButton) {
  console.error("#daily-ai-button not found");
} else {
  dailyButton.addEventListener("click", onDailyClick);
}

const pmButton = document.querySelector("#pm-ai-button");
if (!pmButton) {
  console.error("#pm-ai-button not found");
} else {
  pmButton.addEventListener("click", onPmClick);
}

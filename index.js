function typewriterInto(selector, text) {
  const target = document.querySelector(selector);
  if (!target) return;
  target.innerHTML = "";
  new Typewriter(selector, {
    strings: text,
    autoStart: true,
    cursor: null,
    delay: 20,
  });
}

function callSheCodesAI({
  prompt,
  context,
  targetSelector,
  loadingText,
  onSuccess,
  onError
}) {
  const apiKey = "2046c535afeb092fo82f1d306d8a2b2t";
  const apiUrl = "https://api.shecodes.io/ai/v1/generate";

  const outputElement = document.querySelector(targetSelector);
  if (!outputElement) {
    console.error("Output element not found:", targetSelector);
    return;
  }

  outputElement.classList.add("is-thinking");
  outputElement.innerHTML = `${loadingText} <span aria-hidden="true">...</span>`;

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
      outputElement.classList.remove("is-thinking");
      typewriterInto(targetSelector, answer);
      if (onSuccess) onSuccess();
    })
    .catch((error) => {
      console.error("API error:", error);
      outputElement.classList.remove("is-thinking");
      outputElement.innerHTML =
        "Sorry, there was an error contacting the AI service.";
      if (onError) onError();
    });
}

const WIDGETS = {
  daily: {
    outputSelector: "#daily-ai-output",
    presetsContainer: "#daily-ai-presets",
    generateButton: "#daily-ai-button",
    regenerateButton: "#daily-ai-regenerate",
    copyButton: "#daily-ai-copy",
    metaSelector: "#daily-ai-meta",
    loadingText: "Exploring ideas with AI...",
    context:
      "Keep answers under 140 words. Return HTML only. Use this structure exactly: <p><strong>Use case:</strong> [name]</p><p><strong>Top 3 recommendations</strong></p><ul><li>Recommendation 1</li><li>Recommendation 2</li><li>Recommendation 3</li></ul><p><strong>Next action (15 min):</strong> one short action.</p>",
    prompts: {
      trip:
        "You are an AI concierge for a busy product and AI leader. Give practical ideas for trip planning and execution with AI tools.",
      focus:
        "You are an AI productivity coach for a founder/operator. Give practical ideas to build a focused daily routine with AI.",
      inbox:
        "You are an AI operations assistant. Give practical ways AI can help triage inbox, summarize threads, and draft faster replies."
    }
  },
  pm: {
    outputSelector: "#pm-ai-output",
    presetsContainer: "#pm-ai-presets",
    generateButton: "#pm-ai-button",
    regenerateButton: "#pm-ai-regenerate",
    copyButton: "#pm-ai-copy",
    metaSelector: "#pm-ai-meta",
    loadingText: "Designing AI-powered PM ideas...",
    context:
      "Keep answers under 150 words. Return HTML only. Use this structure exactly: <p><strong>Use case:</strong> [name]</p><p><strong>Top 3 recommendations</strong></p><ul><li>Recommendation 1</li><li>Recommendation 2</li><li>Recommendation 3</li></ul><p><strong>Next action (15 min):</strong> one short action.</p>",
    prompts: {
      prd:
        "You are a senior AI PM advisor. Suggest practical ways AI can accelerate PRD quality and cross-functional alignment.",
      experiment:
        "You are a growth PM advisor. Suggest practical ways AI can improve experiment design, metric selection, and decision speed.",
      risk:
        "You are a platform PM advisor. Suggest practical ways AI can improve risk reviews, dependency mapping, and launch readiness."
    }
  }
};

function setActivePreset(widgetKey, selectedPreset) {
  const widget = WIDGETS[widgetKey];
  const container = document.querySelector(widget.presetsContainer);
  if (!container) return;

  container.querySelectorAll(".preset-chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.preset === selectedPreset);
  });

  widget.currentPreset = selectedPreset;
}

function runWidget(widgetKey, event) {
  if (event) event.preventDefault();
  const widget = WIDGETS[widgetKey];
  const presetKey = widget.currentPreset || Object.keys(widget.prompts)[0];
  const meta = document.querySelector(widget.metaSelector);

  callSheCodesAI({
    prompt: widget.prompts[presetKey],
    context: widget.context,
    targetSelector: widget.outputSelector,
    loadingText: widget.loadingText,
    onSuccess: () => {
      widget.lastGeneratedAt = new Date();
      updateWidgetMeta(widgetKey);
    },
    onError: () => {
      if (meta) meta.textContent = "Generation failed. Please try again.";
    }
  });

  if (meta) meta.textContent = "Generating now...";
}

function formatRelativeTime(date) {
  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours} hr ago`;
}

function updateWidgetMeta(widgetKey) {
  const widget = WIDGETS[widgetKey];
  const meta = document.querySelector(widget.metaSelector);
  if (!meta) return;
  if (!widget.lastGeneratedAt) {
    meta.textContent = "Not generated yet";
    return;
  }
  meta.textContent = `Generated ${formatRelativeTime(widget.lastGeneratedAt)}`;
}

function copyOutput(widgetKey) {
  const widget = WIDGETS[widgetKey];
  const output = document.querySelector(widget.outputSelector);
  if (!output) return;
  const text = output.innerText.trim();
  if (!text) return;
  navigator.clipboard
    .writeText(text)
    .then(() => {
      const button = document.querySelector(widget.copyButton);
      if (!button) return;
      const original = button.textContent;
      button.textContent = "Copied";
      setTimeout(() => {
        button.textContent = original;
      }, 1100);
    })
    .catch((error) => {
      console.error("Clipboard copy failed:", error);
    });
}

Object.keys(WIDGETS).forEach((widgetKey) => {
  const widget = WIDGETS[widgetKey];
  const presetsContainer = document.querySelector(widget.presetsContainer);
  const generateButton = document.querySelector(widget.generateButton);
  const regenerateButton = document.querySelector(widget.regenerateButton);
  const copyButton = document.querySelector(widget.copyButton);

  if (!presetsContainer || !generateButton || !regenerateButton || !copyButton) {
    console.error(`Widget setup incomplete for ${widgetKey}`);
    return;
  }

  const firstChip = presetsContainer.querySelector(".preset-chip");
  if (firstChip) {
    setActivePreset(widgetKey, firstChip.dataset.preset);
  }
  updateWidgetMeta(widgetKey);

  presetsContainer.querySelectorAll(".preset-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      setActivePreset(widgetKey, chip.dataset.preset);
    });
  });

  generateButton.addEventListener("click", (event) => runWidget(widgetKey, event));
  regenerateButton.addEventListener("click", (event) => runWidget(widgetKey, event));
  copyButton.addEventListener("click", () => copyOutput(widgetKey));
});

setInterval(() => {
  Object.keys(WIDGETS).forEach((widgetKey) => updateWidgetMeta(widgetKey));
}, 30000);

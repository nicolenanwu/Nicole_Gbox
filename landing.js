// Landing page interactions: scroll-spy nav highlighting + contact form.
// Vanilla JS, no framework — kept small and dependency-free on purpose.
// Note: the Experience/Ventures/Adventures/Archive hover-highlight and
// sibling-dim effects are pure CSS (see .entry-item in landing.css) —
// no JS needed for those.

document.addEventListener("DOMContentLoaded", function () {
  initScrollSpy();
  initContactForm();
});

function initScrollSpy() {
  const links = document.querySelectorAll(".side-link");
  const blocks = document.querySelectorAll(".content-block[id]");
  if (!links.length || !blocks.length) return;

  const linkByHash = {};
  links.forEach(function (link) {
    linkByHash[link.getAttribute("href")] = link;
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        const hash = "#" + entry.target.id;
        const link = linkByHash[hash];
        if (!link) return;

        if (entry.isIntersecting) {
          links.forEach(function (l) {
            l.classList.remove("is-active");
          });
          link.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  blocks.forEach(function (block) {
    observer.observe(block);
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");
  if (!form) return;

  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const messageInput = document.getElementById("contact-message");
  const submitButton = form.querySelector('button[type="submit"]');

  function showStatus(text, state) {
    status.style.display = "block";
    status.className = "contact-status is-" + state;
    status.textContent = text;
  }

  function openMailFallback(name, email, message) {
    const subject = encodeURIComponent("Message from nicole-wu.com");
    const body = encodeURIComponent(
      `${message}\n\n\u2014 ${name || email} (${email})`
    );
    window.location.href = `mailto:nanwu.nicole@gmail.com?subject=${subject}&body=${body}`;
    showStatus(
      "Your mail app should have opened with a draft \u2014 just hit send.",
      "success"
    );
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = (nameInput.value || "").trim();
    const email = (emailInput.value || "").trim();
    const message = (messageInput.value || "").trim();

    if (!email || !email.includes("@")) {
      showStatus("Please enter a valid email address.", "error");
      return;
    }
    if (!message) {
      showStatus("Please add a short message.", "error");
      return;
    }

    if (submitButton) submitButton.disabled = true;
    showStatus("Sending...", "sending");

    try {
      const response = await fetch("/.netlify/functions/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, source: "/index.html#contact" })
      });
      const data = await response.json().catch(function () {
        return {};
      });

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Message service unavailable.");
      }

      showStatus("Thanks! Your message is on its way.", "success");
      form.reset();
    } catch (err) {
      // Backend isn't reachable (e.g. running locally, or not deployed yet).
      // Fall back to a pre-filled email draft so the message still gets through.
      console.warn("Contact function unavailable, falling back to mailto:", err);
      openMailFallback(name, email, message);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

// Landing page interactions: experience tabs + scroll-spy nav highlighting.
// Vanilla JS, no framework — kept small and dependency-free on purpose.

document.addEventListener("DOMContentLoaded", function () {
  initExperienceTabs();
  initScrollSpy();
});

function initExperienceTabs() {
  const tabs = document.querySelectorAll(".exp-tab");
  const panels = document.querySelectorAll(".exp-panel");
  if (!tabs.length || !panels.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const targetId = tab.getAttribute("data-target");

      tabs.forEach(function (t) {
        t.classList.remove("is-active");
      });
      panels.forEach(function (p) {
        p.classList.remove("is-active");
      });

      tab.classList.add("is-active");
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add("is-active");
    });
  });
}

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

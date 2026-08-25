
let current = "intro";
let completed = 0;
const pages = [...document.querySelectorAll(".page")];
const arrival = document.getElementById("arrival");
const wellies = document.getElementById("wellies");
const navMap = document.getElementById("navMap");

function show(id){
  current = id;
  pages.forEach(p => p.classList.toggle("active", p.id === id));
  navMap.style.visibility = id === "intro" ? "hidden" : "visible";
  window.scrollTo({top:0, behavior:"smooth"});
}

function marker(n){
  return document.querySelector(`.map-marker[data-n="${n}"]`);
}

document.querySelectorAll(".map-marker").forEach(btn => {
  btn.addEventListener("click", () => {
    if (!btn.disabled) show("stop" + btn.dataset.n);
  });
});

document.querySelectorAll(".question").forEach(q => {
  const correct = Number(q.dataset.correct);
  q.querySelectorAll(".choices button").forEach((btn, i) => {
    btn.addEventListener("click", () => {
      q.querySelectorAll(".choices button").forEach(x => x.classList.remove("good","bad"));
      const ok = i === correct;
      btn.classList.add(ok ? "good" : "bad");
      q.querySelector(".feedback").innerHTML = ok
        ? "<b>Best supported.</b> " + q.dataset.explain
        : "Look again at the plant symptoms and weather clues. Which explanation is best supported by both?";
      q.querySelector(".climate").classList.toggle("hidden", !ok);
      q.closest(".scenario").querySelector(".return").classList.remove("hidden");
    });
  });
});

document.querySelectorAll(".return").forEach(btn => {
  btn.addEventListener("click", () => {
    const n = Number(btn.dataset.n);
    completed = Math.max(completed, n);
    marker(n).classList.add("done");

    if (n === 4){
      show("finish");
      return;
    }

    show("map");
    const next = n + 1;
    const nextMarker = marker(next);
    nextMarker.disabled = true;
    nextMarker.classList.remove("ready");

    arrival.textContent = "Heading to the next garden area…";

    // Brief pause after returning to the garden, then move the boots.
    setTimeout(() => {
      wellies.className = "wellies pos" + next;
    }, 350);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => {
      nextMarker.disabled = false;
      nextMarker.classList.add("ready");
      arrival.textContent = `Stop ${next} is ready. Select ${nextMarker.querySelector("small").textContent.toLowerCase()} to continue.`;
    }, reduced ? 450 : 1900);
  });
});

document.getElementById("start")?.addEventListener("click", () => show("map"));
navMap.addEventListener("click", () => show("map"));

show("intro");

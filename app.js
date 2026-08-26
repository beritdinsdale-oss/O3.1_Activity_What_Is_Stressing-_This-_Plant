
const pages = [...document.querySelectorAll(".page")];
const arrival = document.getElementById("arrival");
const wellies = document.getElementById("wellies");
const navMap = document.getElementById("navMap");
let unlocked = 1;

function showPage(id){
  pages.forEach(p => p.classList.toggle("active", p.id === id));
  if (navMap) navMap.style.visibility = id === "intro" ? "hidden" : "visible";
  window.scrollTo({top:0, behavior:"smooth"});
}

function hotspot(n){
  return document.querySelector(`.map-hotspot[data-n="${n}"]`);
}

function openStop(n){
  const target = hotspot(n);
  if (!target || target.disabled || n > unlocked) return;
  showPage("stop" + n);
}

function unlockStop(n){
  unlocked = Math.max(unlocked, n);
  const target = hotspot(n);
  if (target){
    target.disabled = false;
    target.classList.add("ready");
  }
}

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

    if (n === 4){
      showPage("finish");
      return;
    }

    const next = n + 1;
    showPage("map");
    arrival.textContent = "Heading to the next garden area…";

    setTimeout(() => {
      wellies.className = "garden-steps step" + next;
    }, 300);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => {
      unlockStop(next);
      arrival.textContent = `Stop ${next} is ready. Select the next numbered garden area to continue.`;
    }, reduced ? 400 : 1750);
  });
});

if (navMap){
  navMap.addEventListener("click", () => showPage("map"));
}

window.showPage = showPage;
window.openStop = openStop;

showPage("intro");

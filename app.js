const pages=[...document.querySelectorAll(".page")];let current=0;
const progress=document.getElementById("progress"),back=document.getElementById("back");
function show(n){current=Math.max(0,Math.min(n,pages.length-1));pages.forEach((p,i)=>p.classList.toggle("active",i===current));progress.textContent=`${current+1} of ${pages.length}`;back.style.visibility=current===0?"hidden":"visible";window.scrollTo({top:0,behavior:"smooth"});}
document.querySelectorAll("[data-next]").forEach(b=>b.addEventListener("click",()=>show(current+1)));
document.querySelectorAll("[data-walk]").forEach(b=>b.addEventListener("click",()=>show(current+1)));
back.addEventListener("click",()=>show(current-1));
document.querySelectorAll(".choices").forEach(group=>{group.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{
 const correct=group.dataset.answer,ok=btn.dataset.value===correct;group.querySelectorAll("button").forEach(x=>x.classList.remove("correct","wrong"));btn.classList.add(ok?"correct":"wrong");
 const fb=group.parentElement.querySelector(".feedback");const stop=group.closest(".scenario")?.dataset.stop;
 const messages={
 "1": ok?"<strong>Yes.</strong> Sustained high temperatures—especially warm nights—can interfere with flowering and fruit set. The weather clue makes heat a strong explanation.":"The plant photo alone could have several explanations. Here, the unusually hot days and nights are the strongest clue.",
 "2": ok?"<strong>Yes.</strong> Wilting can happen during high heat even when soil is moist, especially if the plant recovers when temperatures cool.":"Check all the evidence: the soil is moist and the plant recovers overnight. That makes simple lack of soil water less convincing.",
 "3": ok?"<strong>Yes.</strong> Saturated soil after repeated heavy rain can stress roots.":"The repeated rain and saturated soil are important evidence. Look beyond the leaf color alone.",
 "4": ok?"<strong>Yes.</strong> The sudden damage after a below-freezing night strongly supports cold or freeze injury.":"The timing matters: healthy growth followed by a freezing night gives us a strong environmental clue.",
 "5": ok?"<strong>Yes.</strong> Hail and strong storms can cause sudden physical damage such as torn leaves and broken stems.":"The sudden damage immediately after a hailstorm points to an acute weather extreme."
 };fb.innerHTML=messages[stop]||"Use both the plant and the conditions as evidence.";
 group.closest(".scenario").querySelector(".continue").classList.remove("hidden");
}))});
document.getElementById("restart").addEventListener("click",()=>show(0));show(0);
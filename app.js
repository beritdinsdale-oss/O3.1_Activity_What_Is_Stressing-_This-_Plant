const pages=[...document.querySelectorAll(".page")];
const pageByName=n=>document.querySelector(`[data-page="${n}"]`);
let current="intro",completed=0,unlocked=1,animating=false;
const boots=document.getElementById("boots"),arrival=document.getElementById("arrival"),back=document.getElementById("back"),progress=document.getElementById("progress");

const feedback={
1:{ok:"<strong>Best supported.</strong> The combination of very hot days and unusually warm nights is important evidence. High temperatures can interfere with tomato pollination and fruit set even when soil moisture is not extremely low.",no:"Look across all five conditions. Low rainfall could matter, but the soil is still moderately moist. The unusually high daytime <em>and</em> nighttime temperatures provide the stronger explanation for poor fruit set."},
2:{ok:"<strong>Best supported.</strong> The soil is moist, the wilting occurs during the hottest part of the day, and the plant recovers overnight. Together, those clues fit temporary heat stress better than simple drought.",no:"Several causes can produce wilting. Here, the timing matters: moist soil + hot afternoons + overnight recovery makes temporary heat stress the better-supported explanation."},
3:{ok:"<strong>Best supported.</strong> Repeated rain and saturated soil can reduce oxygen around roots. That can interfere with root function and produce symptoms such as slow growth, yellowing, and even wilting.",no:"The rainfall itself is not the diagnosis. Follow the chain of evidence: repeated rain → saturated soil → stressed root function. That explanation fits more of the observations than the alternatives."},
4:{ok:"<strong>Best supported.</strong> The damage appeared after a below-freezing night and is concentrated in tender, exposed growth. The timing and pattern both support freeze injury.",no:"Use the timing and pattern together. A below-freezing night followed by sudden injury to tender exposed tissue makes cold damage the strongest explanation here."}
};

function show(name){
 current=name;
 pages.forEach(p=>p.classList.toggle("active",p.dataset.page===name));
 progress.textContent=name==="intro"?"Start":name==="map"?"Garden map":name==="finish"?"Complete":name.replace("stop","Stop ");
 back.style.visibility=name==="intro"?"hidden":"visible";
 window.scrollTo({top:0,behavior:"smooth"});
}
document.getElementById("start").onclick=()=>show("map");

document.querySelectorAll(".map-stop").forEach(btn=>{
 btn.addEventListener("click",()=>{
   const n=+btn.dataset.stop;
   if(n<=unlocked && !animating) show("stop"+n);
 });
});

document.querySelectorAll(".choices").forEach(group=>{
 group.querySelectorAll("button").forEach(btn=>btn.onclick=()=>{
   const n=+group.dataset.stop,ok=btn.dataset.value===group.dataset.correct;
   group.querySelectorAll("button").forEach(b=>b.classList.remove("correct","wrong"));
   btn.classList.add(ok?"correct":"wrong");
   group.parentElement.querySelector(".feedback").innerHTML=ok?feedback[n].ok:feedback[n].no;
   group.closest(".scenario").querySelector(".return").classList.remove("hidden");
 });
});

document.querySelectorAll(".return").forEach(btn=>btn.onclick=()=>{
 const n=+btn.dataset.complete;
 completed=Math.max(completed,n);
 document.querySelector(`.map-stop[data-stop="${n}"]`).classList.add("done");
 if(n===4){show("map");arrival.textContent="You’ve visited every stop.";setTimeout(()=>show("finish"),850);return;}
 unlocked=Math.max(unlocked,n+1);
 const next=document.querySelector(`.map-stop[data-stop="${n+1}"]`);
 next.disabled=true;next.classList.remove("ready");
 show("map");
 animateTo(n+1);
});

function animateTo(n){
 animating=true;
 arrival.textContent="Follow the boots to the next stop…";
 requestAnimationFrame(()=>{
   boots.className=`boots at${n}`;
 });
 const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 setTimeout(()=>{
   const next=document.querySelector(`.map-stop[data-stop="${n}"]`);
   next.disabled=false;next.classList.add("ready");
   arrival.textContent=`The boots have arrived. Stop ${n} is ready—select ${next.querySelector("small").textContent.toLowerCase()} to continue.`;
   animating=false;
 },reduced?100:1650);
}
back.onclick=()=>{
 if(current.startsWith("stop")||current==="finish") show("map");
 else if(current==="map") show("intro");
};
document.getElementById("restart").onclick=()=>{
 completed=0;unlocked=1;animating=false;boots.className="boots at1";
 document.querySelectorAll(".map-stop").forEach((b,i)=>{b.classList.remove("done","ready");b.disabled=i!==0;});
 arrival.textContent="Stop 1 is ready. Select the tomatoes to begin.";show("intro");
};
show("intro");
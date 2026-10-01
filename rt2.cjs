const { JSDOM } = require("jsdom");
const errors = [];

JSDOM.fromURL("http://localhost:5199/", {
  runScripts: "dangerously",
  resources: "usable",
  pretendToBeVisual: true,
  beforeParse(w) {
    w.matchMedia = (q) => ({
      matches: false, media: q, onchange: null,
      addEventListener() {}, removeEventListener() {},
      addListener() {}, removeListener() {}, dispatchEvent() { return false; },
    });
    w.IntersectionObserver = class {
      constructor(cb){ this.cb=cb; }
      observe(el){ this.cb([{isIntersecting:true,target:el,intersectionRatio:1}],this); }
      unobserve(){} disconnect(){} takeRecords(){return[];}
    };
  },
}).then((dom) => {
  const w = dom.window;
  w.addEventListener("error", (e) => errors.push("ERR: " + (e.error && e.error.stack || e.message)));
  const oe = console.error;
  console.error = (...a) => { errors.push("CONSOLE: " + a.map(String).join(" ").slice(0,900)); oe(...a); };
  setTimeout(() => {
    console.log("root children:", w.document.getElementById("root").childElementCount);
    console.log("sections:", w.document.querySelectorAll("section[id]").length);
    console.log("\n==== ERRORS ====");
    console.log(errors.slice(0, 6).join("\n---\n") || "(none)");
    process.exit(0);
  }, 4000);
}).catch(e => { console.log("load failed:", e.message); process.exit(1); });

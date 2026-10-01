const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(process.cwd(), "dist", "index.html"), "utf8");
const errors = [];
const warns = [];

const dom = new JSDOM(html, {
  url: "http://localhost/",
  pretendToBeVisual: true,
  runScripts: "dangerously",
  resources: undefined,
  beforeParse(w) {
    w.matchMedia = w.matchMedia || ((q) => ({
      matches: false, media: q, onchange: null,
      addEventListener() {}, removeEventListener() {},
      addListener() {}, removeListener() {}, dispatchEvent() { return false; },
    }));
    w.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
    w.cancelAnimationFrame = (id) => clearTimeout(id);
    w.scrollTo = () => {};
    w.IntersectionObserver = class {
      constructor(cb) { this.cb = cb; }
      observe(el) { this.cb([{ isIntersecting: true, target: el, intersectionRatio: 1 }], this); }
      unobserve() {} disconnect() {} takeRecords() { return []; }
    };
  },
});

const w = dom.window;
w.addEventListener("error", (e) => errors.push("window error: " + (e.error && e.error.stack || e.message)));
const origErr = console.error;
console.error = (...a) => { errors.push("console.error: " + a.map(String).join(" ").slice(0, 400)); origErr(...a); };
console.warn  = (...a) => warns.push(a.map(String).join(" ").slice(0, 200));

// load the built JS
const jsFile = fs.readdirSync(path.join(process.cwd(), "dist", "assets")).find(f => /^index-.*\.js$/.test(f));
const code = fs.readFileSync(path.join(process.cwd(), "dist", "assets", jsFile), "utf8");

try {
  w.eval(code);
} catch (e) {
  errors.push("THROWN: " + e.stack);
}

setTimeout(() => {
  const root = w.document.getElementById("root");
  const html2 = root ? root.innerHTML : "";
  console.log("---- module loaded:", jsFile);
  console.log("---- #root childElementCount:", root ? root.childElementCount : "no root");
  console.log("---- #root innerHTML length:", html2.length);
  console.log("---- <main> present:", !!w.document.querySelector("main"));
  console.log("---- sections found:", w.document.querySelectorAll("section[id]").length);
  console.log("---- h1 text:", (w.document.querySelector("h1") || {}).textContent || "(none)");
  console.log("\n---- ERRORS (" + errors.length + ") ----");
  errors.slice(0, 12).forEach(e => console.log(e));
  if (!errors.length) console.log("(none)");
  console.log("\n---- WARNINGS (" + warns.length + ") ----");
  warns.slice(0, 12).forEach(e => console.log(e));
  if (!warns.length) console.log("(none)");
  process.exit(0);
}, 1500);

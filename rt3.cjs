const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.join(process.cwd(),"dist","index.html"),"utf8");
const errors = [];
const dom = new JSDOM(html, { url:"http://localhost/", runScripts:"dangerously", pretendToBeVisual:true,
  beforeParse(w){
    w.matchMedia = q => ({matches:false,media:q,onchange:null,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){},dispatchEvent(){return false;}});
    w.requestAnimationFrame = cb => setTimeout(()=>cb(Date.now()),16);
    w.cancelAnimationFrame = id => clearTimeout(id);
    w.IntersectionObserver = class { constructor(cb){this.cb=cb;} observe(el){this.cb([{isIntersecting:true,target:el,intersectionRatio:1}],this);} unobserve(){} disconnect(){} takeRecords(){return[];} };
  }});
const w = dom.window;
w.addEventListener("error", e => errors.push((e.error && e.error.stack) || e.message));
const oe = console.error; console.error = (...a)=>{errors.push(a.map(x=> (x&&x.stack)||String(x)).join(" ").slice(0,1500)); oe(...a);};
const js = fs.readdirSync(path.join(process.cwd(),"dist","assets")).find(f=>/^index-.*\.js$/.test(f));
try { w.eval(fs.readFileSync(path.join(process.cwd(),"dist","assets",js),"utf8")); } catch(e){ errors.push("THROWN "+e.stack); }
setTimeout(()=>{
  console.log("js:", js);
  console.log("root children:", w.document.getElementById("root").childElementCount);
  console.log("\n==== FIRST ERROR ====");
  console.log(errors[0] || "(none)");
  process.exit(0);
},1500);

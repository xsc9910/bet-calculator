const fs=require('fs'),assert=require('assert/strict');
const elements=new Map();
const el=()=>({value:'',checked:false,hidden:false,options:[],style:{},className:'',textContent:'',innerHTML:'',clientWidth:600,scrollTop:0,scrollLeft:0,
 classList:{values:new Set(),toggle(name,on){if(on)this.values.add(name);else this.values.delete(name);},add(){},remove(){}},closest(){return null;},replaceChildren(){},append(){},setAttribute(){},showModal(){},close(){},click(){}});
const get=id=>{if(!elements.has(id))elements.set(id,el());return elements.get(id);};
const doc={getElementById:get,querySelectorAll(){return [];},createElement:el};
const storage={getItem(){return null;},setItem(){}};
let next=1;const timers=new Map(),realSet=global.setTimeout,realClear=global.clearTimeout;
global.setTimeout=(fn,ms)=>{const id=next++;timers.set(id,{fn,ms});return id;};global.clearTimeout=id=>timers.delete(id);
function run(ms){const pending=[...timers].filter(([,t])=>t.ms===ms);for(const [id,t] of pending){timers.delete(id);t.fn();}}
try{
 const app=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {entries:()=>betEntries};')(storage,doc,()=>false,{clipboard:{writeText(){}}});
 const input=get('rawBetText'),overlay=get('rawBetHighlights'),warning=get('rawBetNumberWarning'),wrapper=get('singleRawTextWrapper');
 input.value='福123一直一组';input.oninput({inputType:'insertText'});run(300);
 assert.equal(overlay.innerHTML,'');assert.equal(wrapper.classList.values.has('has-highlights'),false);
 get('autoMode').checked=true;
 input.onpaste();input.oninput({inputType:'insertFromPaste'});run(120);
 assert.equal(app.entries().length,1);assert.equal(input.value,'福123一直一组');run(1000);
 assert.equal(input.value,'');assert.equal(overlay.innerHTML,'');assert.equal(warning.hidden,true);assert.equal(wrapper.classList.values.has('has-highlights'),false);
 input.value='福123 234456 567一直一组';input.oninput({inputType:'insertText'});run(300);
 assert.match(overlay.innerHTML,/<mark>234456<\/mark>/);assert.equal(warning.hidden,false);assert.equal(wrapper.classList.values.has('has-highlights'),true);
 input.onpaste();input.oninput({inputType:'insertFromPaste'});run(120);run(1000);
 assert.equal(app.entries().length,1);assert.equal(input.value,'福123 234456 567一直一组');
 input.value='福123 234 456 567一直一组';input.oninput({inputType:'insertText'});run(300);
 assert.equal(overlay.innerHTML,'');assert.equal(warning.hidden,true);assert.equal(wrapper.classList.values.has('has-highlights'),false);
 input.onpaste();input.oninput({inputType:'insertFromPaste'});run(120);assert.equal(app.entries().length,2);
 input.value='福789一直一组';input.oninput({inputType:'insertText'});run(1000);assert.equal(input.value,'福789一直一组');
 console.log('INPUT_CLEAR_HIGHLIGHT passed');
}finally{global.setTimeout=realSet;global.clearTimeout=realClear;}

const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
const original=`福直317 317 544 454  409 814 418 904 各打一米

福直317 409 904 814 418 814 904一倍

体直801 981  803
328 981 801 508 705 328 981 801一倍
共44`;
console.log(JSON.stringify(api.autoCalculateBet(original)));
let checks=0;
function amount(text,expected,claimed){const r=api.autoCalculateBet(text);assert.equal(r.amount,expected,JSON.stringify({text,r}));assert.equal(r.confident,true);if(claimed!==undefined)assert.equal(r.claimed,claimed);checks++;}
function prize(text,lottery,draw,expected){const wins=api.scanEntryForDraw({id:'test',original:text,amount:999},lottery,draw);assert.equal(wins.reduce((s,w)=>s+w.prize,0),expected,JSON.stringify({text,lottery,draw,wins}));checks++;}
amount(original,44,44);
amount(original.replace('共44','共45'),44,45);
for(const [lottery,draw,expected] of [['福彩','317',3800],['福彩','814',4750],['体彩','801',5700],['体彩','981',5700],['福彩','801',0],['体彩','317',0]])prize(original,lottery,draw,expected);
for(const label of ['直','直选','单','组','组选'])for(const [rate,stake] of [['各打一米',1],['一倍',2],['各0.5元',.5],['各打三倍',6]])for(const sep of [' ','\n','，'])for(const lottery of ['福','体','福体']){
 const text=`${lottery}${label}001${sep}001${sep}112${sep}123${rate}\n体直456一倍\n共999`;
 const group=/组/.test(label),both=lottery==='福体';
 amount(text,4*stake*(both?2:1)+2,999);
 for(const game of ['福彩','体彩']){
  const includes=both||(game==='福彩'?lottery==='福':lottery==='体');
  prize(text,game,'001',includes?2*stake*(group?310:950):0);
  prize(text,game,'321',includes&&group?stake*155:0);
  prize(text,game,'456',game==='体彩'?1900:0);
 }
}
amount('福直001 112一米\n体直123',4);
for(const text of [original+'\n未知玩法99元','福直001112一米'])assert.equal(api.autoCalculateBet(text).confident,false,JSON.stringify({text,result:api.autoCalculateBet(text)}));
console.log(JSON.stringify({checks:checks+2,failures:0}));

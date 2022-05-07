const fs=require('fs');
const assert=require('assert/strict');
const element=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const app=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:element,querySelectorAll(){return [];},createElement:element},()=>false,{});
let checks=0;
for(const [a,b] of [['福','体'],['体','福']])for(const play of ['组六','组三'])for(const [rate,stake] of [['五十',50],['50',50],['五十元',50],['各20米',20],['两倍',20],['0.5米',0.5]])for(const separator of ['', '\n']) {
 const source=`${a}012589\n${b}134568${separator}${play}${rate}合计${stake*2}`;
 const result=app.autoCalculateBet(source);
 assert.deepEqual([result.amount,result.claimed,result.confident],[stake*2,stake*2,true],JSON.stringify({source,result}));checks++;
 for(const [lottery,draw,expected] of [[a==='福'?'福彩':'体彩',play==='组六'?'129':'122',stake*(play==='组六'?7.9:10.5)],[b==='福'?'福彩':'体彩',play==='组六'?'129':'122',0]]){
  const wins=app.scanEntryForDraw({id:'tail',original:source,amount:stake*2},lottery,draw);
  assert.equal(Number(wins.reduce((sum,win)=>sum+win.prize,0).toFixed(2)),Number(expected.toFixed(2)),JSON.stringify({source,wins}));checks++;
 }
}
const original='福012589\n体134568组六五十合计100';
assert.equal(app.autoCalculateBet(original.replace('100','999')).amount,100);checks++;
assert.equal(app.autoCalculateBet(original.replace('100','999')).claimed,999);checks++;
console.log(JSON.stringify({checks,failures:0,original:app.autoCalculateBet(original)}));

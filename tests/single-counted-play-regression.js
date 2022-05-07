const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const app=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
let checks=0;
for(const lottery of ['福','体','福体'])for(const [word,times] of [['一',1],['两',2],['三',3],['2',2]])for(const play of ['单','直','组'])for(const codes of ['692','008','692 269']){
 const count=codes.split(' ').length,factor=lottery==='福体'?2:1;
 const amount=count*times*2*factor;
 const source=`${lottery}${codes}${word==='2'?' ':''}${word}${play}合计${amount}`;
 const result=app.autoCalculateBet(source);assert.deepEqual([result.amount,result.claimed,result.confident],[amount,amount,true],JSON.stringify({source,result}));checks++;
 const draw=codes.split(' ')[0];
 for(const target of ['福彩','体彩']){
  const active=lottery==='福体'||target===(lottery==='福'?'福彩':'体彩');
  const expected=active?times*2*(play==='组'?(draw==='008'?310:155)*count:950):0;
  const wins=app.scanEntryForDraw({id:'counted',original:source,amount},target,draw);
  assert.equal(wins.reduce((sum,win)=>sum+win.prize,0),expected,JSON.stringify({source,target,wins}));checks++;
 }
}
assert.equal(app.autoCalculateBet('福692两单合计99').amount,4);
assert.equal(app.autoCalculateBet('福692两单合计99').claimed,99);
console.log(JSON.stringify({checks:checks+2,failures:0,original:app.autoCalculateBet('福692两单合计4')}));

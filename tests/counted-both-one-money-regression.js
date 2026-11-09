const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
let checks=0;
for(const [lottery,target,factor] of [['福','福彩',1],['体','体彩',1],['福体','福彩',2]]) for(const play of ['一直一组','一单一组','一组一直','一组一单']) for(const rate of ['一米','1米','一元','1元']) for(const sep of ['、',' ','-']) {
  const text=`${lottery}522${sep}588${sep}288${play}${rate}合计${6*factor}`;
  const result=api.autoCalculateBet(text);
  assert.deepEqual([result.amount,result.claimed,result.confident],[6*factor,6*factor,true],JSON.stringify({text,result}));
  const wins=api.scanEntryForDraw({id:'one-money',original:text,amount:result.amount},target,'522');
  assert.equal(wins.reduce((sum,win)=>sum+win.prize,0),1260,JSON.stringify({text,wins}));
  assert.deepEqual(wins.map(win=>win.stake),[1,1],JSON.stringify({text,wins}));checks++;
}
for(const text of ['福507一直一组1米合计2','体522、588、288一直一组一米合计6']) {
  const result=api.autoCalculateBet(text); assert.equal(result.amount,result.claimed,JSON.stringify({text,result}));checks++;
}
console.log(JSON.stringify({checks,failures:0}));

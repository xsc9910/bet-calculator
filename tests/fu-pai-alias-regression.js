const fs=require('fs'),assert=require('assert/strict');const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null},setItem(){}},{getElementById:el,querySelectorAll(){return []},createElement:el},()=>false,{});
let checks=0;
for(const marker of ['福排','福彩排三','福排列三','排福','排三福','福体'])for(const slash of ['', '\\'])for(const order of ['before','after'])for(const play of ['一直一组','一单一组']) {
 const list=['478','178','498','468'].join(`${slash}\n`),text=order==='before'?`${marker}${play}\n${list}${slash}\n共32`:`${list}${slash}\n${marker}${play}${slash}\n共32`;
 const result=api.autoCalculateBet(text);assert.deepEqual([result.amount,result.claimed,result.confident],[32,32,true],JSON.stringify({text,result}));
 for(const lottery of ['福彩','体彩']) {
  const wins=api.scanEntryForDraw({id:'x',original:text,amount:32},lottery,'478');
  assert.deepEqual(wins.map(w=>w.stake),[2,2],JSON.stringify({text,lottery,wins}));
  assert.deepEqual(wins.map(w=>w.prize),[1900,310],JSON.stringify({text,lottery,wins}));
 }checks++;
}
for(const [lottery,draw,expected] of [['福彩','123',2],['体彩','123',0],['体彩','456',2],['福彩','456',0]]){
 const text='福123一直一组\n排456一直一组\n共8',wins=api.scanEntryForDraw({id:'x',original:text,amount:8},lottery,draw);assert.equal(wins.length,expected,JSON.stringify({lottery,draw,wins}));
}
console.log(`FU_PAI_ALIAS passed=${checks+4}`);

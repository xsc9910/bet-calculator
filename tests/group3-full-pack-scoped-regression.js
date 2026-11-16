const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null},setItem(){}},{getElementById:el,querySelectorAll(){return []},createElement:el},()=>false,{});
let checks=0;
for(const [marker,target,factor] of [['3D','福彩',1],['福','福彩',1],['体','体彩',1],['福体','福彩',2]]) for(const dash of ['一','-','—']) for(const [number,amount,unit] of [['023',4,'元'],['134',10,'米'],['987',0.5,'元']]) {
 const text=`${marker}直${number}${dash}${amount}${unit}`,result=api.autoCalculateBet(text);
 assert.deepEqual([result.amount,result.confident],[amount*factor,true],JSON.stringify({text,result}));
 const wins=api.scanEntryForDraw({id:'t',original:text,amount:result.amount},target,number);
 assert.deepEqual(wins.map(w=>[w.stake,w.prize]),[[amount,amount*950]],JSON.stringify({text,wins}));checks++;
}
for(const [marker,target,factor] of [['福','福彩',1],['体','体彩',1],['福体','福彩',2]]) {
 const text=`${marker}，1的胆，120\n${marker}，7的胆，150\n${marker}，组三，50\n合计${320*factor}`,result=api.autoCalculateBet(text);
 assert.deepEqual([result.amount,result.claimed,result.confident],[320*factor,320*factor,true],JSON.stringify(result));
 for(const draw of ['112','117','123','777','889']){
  const wins=api.scanEntryForDraw({id:'t',original:text,amount:result.amount},target,draw);
  const parts=[['独胆1 120元',120],['独胆7 150元',150],['组三全包50元',50]];
  const expected=parts.flatMap(([part,amount])=>api.scanEntryForDraw({id:'p',original:`${target}${part}`,amount},target,draw));
  assert.deepEqual(wins.map(w=>[w.match,w.stake,w.prize]),expected.map(w=>[w.match,w.stake,w.prize]),JSON.stringify({text,draw,wins,expected}));checks++;
 }
}
console.log(`GROUP3_FULL_PACK_SCOPED passed=${checks}`);

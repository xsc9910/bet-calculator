const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
const original=`福一直一组
963  213  249  423  746       749  796  946  546  745  945  756  956  795  517  519  597  917  516  617  916  567  596  967  835
体一直一组
513  545  045 155   548  549  598  948  540  048  940  508  590  908  925  927  975  725  025  720  920  705  905  970  953
共200`;
console.log(JSON.stringify(api.autoCalculateBet(original)));
let checks=0;
function check(text,expected,claimed){const result=api.autoCalculateBet(text);assert.equal(result.amount,expected,JSON.stringify({text,result}));assert.equal(result.confident,true);if(claimed!==undefined)assert.equal(result.claimed,claimed);checks++;}
check(original,200,200);
check(original.replace('共200','共201'),200,201);
const headers=[['一直一组',2,2],['一组一直',2,2],['一单一组',2,2],['一组一单',2,2],['直组各0.5米',.5,.5],['组选3元直选2元',2,3],['直选2倍组选1倍',4,2]];
for(const [header,d,g] of headers)for(const separator of [' ','  ','，','\n'])for(const tags of [['福','体'],['体彩','福彩'],['福体','体']]){
 const text=`${tags[0]}${header}\n001${separator}112${separator}123${separator}123\n${tags[1]}直组1米\n456${separator}455\n共999`;
 check(text,4*(d+g)*(tags[0]==='福体'?2:1)+4,999);
 for(const lottery of ['福彩','体彩'])for(const draw of ['001','112','123','321','456','455']){
  const first=tags[0]==='福体'||(lottery==='福彩'?tags[0]==='福':tags[0]==='体彩');
  const second=lottery==='福彩'?tags[1]==='福彩':tags[1]==='体';
  let expected=0;
  for(const [nums,dir,grp] of [[first?['001','112','123','123']:[],d,g],[second?['456','455']:[],1,1]])for(const n of nums){
   if(n===draw)expected+=dir*950;
   if([...n].sort().join('')===[...draw].sort().join(''))expected+=grp*(new Set(draw).size===2?310:155);
  }
  const wins=api.scanEntryForDraw({id:'header',original:text,amount:999},lottery,draw);
  assert.equal(wins.reduce((s,w)=>s+w.prize,0),expected,JSON.stringify({text,lottery,draw,wins}));checks++;
 }
}
for(const text of ['福一直一组\n001 112\n未知99元','福一直一组\n001112','福一直一组\n001 112\n体一直一组']){
 assert.equal(api.autoCalculateBet(text).confident,false,JSON.stringify({text,result:api.autoCalculateBet(text)}));checks++;
}
console.log(JSON.stringify({checks,failures:0}));

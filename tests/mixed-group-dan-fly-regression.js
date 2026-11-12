const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null},setItem(){}},{getElementById:el,querySelectorAll(){return []},createElement:el},()=>false,{});
const text='123478 组三1倍组六2倍\\\n胆7  2倍 双飞27一倍\\\n3D合计60';
let checks=0;
for(const [marker,target,factor] of [['福','福彩',1],['体','体彩',1],['福体','福彩',2],['3D','福彩',1]]) for(const reversed of [false,true]) for(const slash of ['', '\\']) {
 const group=reversed?'组六2倍组三1倍':'组三1倍组六2倍';
 const input=`123478 ${group}${slash}\n胆7 2倍 双飞27一倍${slash}\n${marker}合计${60*factor}`;
 const result=api.autoCalculateBet(input);
 assert.deepEqual([result.amount,result.claimed,result.confident],[60*factor,60*factor,true],JSON.stringify({input,result}));
 assert.equal(result.parts.length,4);
 for(const draw of ['127','227','777','159']) {
   const wins=api.scanEntryForDraw({id:'mixed',original:input,amount:result.amount},target,draw);
   const expected=result.parts.flatMap(p=>api.scanEntryForDraw({id:'part',original:p.original.replace(/福体/g,target),amount:p.amount/factor},target,draw));
   assert.deepEqual(wins.map(w=>[w.match,w.stake,w.prize]),expected.map(w=>[w.match,w.stake,w.prize]),JSON.stringify({input,draw,wins,expected}));
 }
 checks++;
}
assert.equal(api.autoCalculateBet(text).amount,60);
const wrong=api.autoCalculateBet(text.replace('60','61'));
assert.deepEqual([wrong.amount,wrong.claimed],[60,61]);
console.log(`MIXED_GROUP_DAN_FLY passed=${checks+2}`);

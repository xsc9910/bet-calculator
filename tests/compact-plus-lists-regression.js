const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null},setItem(){}},{getElementById:el,querySelectorAll(){return []},createElement:el},()=>false,{});
let checks=0;
for(const [marker,target,factor] of [['福','福彩',1],['体','体彩',1],['福体','福彩',2]]) for(const separator of ['.',' ','、','-']) for(const [rate,direct,group] of [['1+1',2,2],['2+3',4,6],['1+1元',1,1],['10+10米',10,10],['0.5+2元',0.5,2]]) {
 const text=`${marker}，433${separator}843${separator}${rate}`, result=api.autoCalculateBet(text),amount=2*(direct+group)*factor;
 assert.deepEqual([result.amount,result.confident],[amount,true],JSON.stringify({text,result}));
 const wins=api.scanEntryForDraw({id:'t',original:text,amount},target,'433');
 assert.deepEqual(wins.map(w=>w.stake),[direct,group],JSON.stringify({text,wins}));checks++;
}
console.log(`COMPACT_PLUS_LISTS passed=${checks}`);

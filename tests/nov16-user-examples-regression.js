const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null},setItem(){}},{getElementById:el,querySelectorAll(){return []},createElement:el},()=>false,{});
let checks=0;
for(const [marker,target,factor] of [['福','福彩',1],['体','体彩',1],['福体','福彩',2]])for(const separator of ['.',' ','、','-'])for(const [direct,group] of [[6,2],[1,5],[0.5,2],[10,10]]){
 const total=2*(direct+group)*factor,text=`012${separator}123${separator}${direct}元直，组${group}元合计${total}${marker}`,result=api.autoCalculateBet(text);
 assert.deepEqual([result.amount,result.claimed,result.confident],[total,total,true],JSON.stringify({text,result}));
 const wins=api.scanEntryForDraw({id:'mixed',original:text,amount:total},target,'012');
 assert.deepEqual(wins.map(w=>w.stake),[direct,group],JSON.stringify({text,wins}));checks++;
}
for(const marker of ['福','体','福体'])for(const slash of ['', '\\']){
 const factor=marker==='福体'?2:1,text=`${marker}，1的胆，120${slash}\n${marker}，7的胆，150${slash}\n${marker}，组三，50${slash}\n合计${320*factor}`,result=api.autoCalculateBet(text);
 assert.deepEqual([result.amount,result.claimed,result.confident],[320*factor,320*factor,false],JSON.stringify({text,result}));
 assert.ok(result.needs.some(s=>s.includes('组三')),JSON.stringify(result));
 assert.equal(api.scanEntryForDraw({id:'incomplete',original:text,amount:result.amount},marker==='体'?'体彩':'福彩','123').length,0);checks++;
}
console.log(`NOV16_EXAMPLES passed=${checks}`);

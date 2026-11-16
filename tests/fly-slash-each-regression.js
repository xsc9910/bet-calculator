const fs=require('fs'),assert=require('assert/strict');const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null},setItem(){}},{getElementById:el,querySelectorAll(){return []},createElement:el},()=>false,{});
let checks=0;
for(const [marker,target,factor] of [['福','福彩',1],['体','体彩',1],['福体','福彩',2]]) for(const sep of ['/','、',' ','-','／']) for(const each of ['个打','各打','各'])for(const [rate,stake] of [['50',50],['20元',20],['2倍',20],['五毛',0.5]])for(const order of ['before','after']) {
 const nums=['43','23','24'].join(sep),body=order==='before'?`${nums}${each}${rate}双飞`:`${nums}双飞${each}${rate}`,text=`${marker}${body}`,result=api.autoCalculateBet(text);
 assert.deepEqual([result.amount,result.confident],[3*stake*factor,true],JSON.stringify({text,result}));
 const wins=api.scanEntryForDraw({id:'x',original:text,amount:result.amount},target,'432');
 assert.equal(wins.length,3,JSON.stringify({text,wins}));assert.ok(wins.every(w=>w.stake===stake&&w.prize===stake*17),JSON.stringify({text,wins}));
 assert.equal(api.scanEntryForDraw({id:'x',original:text,amount:result.amount},target,'111').length,0);checks++;
}
const missing=api.autoCalculateBet('43/23/24个打50 双飞');assert.deepEqual([missing.amount,missing.confident],[150,false]);
const mismatch=api.autoCalculateBet('福43/23/24双飞各打50合计160');assert.deepEqual([mismatch.amount,mismatch.claimed],[150,160]);
console.log(`FLY_SLASH_EACH passed=${checks+2}`);

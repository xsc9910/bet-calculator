const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null},setItem(){}},{getElementById:el,querySelectorAll(){return []},createElement:el},()=>false,{});
let checks=0;
for(const [marker,target,factor] of [['福','福彩',1],['体','体彩',1],['福体','福彩',2]]) for(const selection of ['3456','34569','345690','34569012','0123456789']) for(const play of ['', '组']) for(const [rate,stake] of [['五米',5],['一倍',10],[' 2倍',20],[' 0.5元',0.5]]) {
 const text=`${marker}${selection}${play}${rate}`,result=api.autoCalculateBet(text);
 assert.deepEqual([result.amount,result.confident],[stake*factor,true],JSON.stringify({text,result}));
 const wins=api.scanEntryForDraw({id:'x',original:text,amount:result.amount},target,'345');
 assert.equal(wins.length,1,JSON.stringify({text,wins}));assert.equal(wins[0].stake,stake);assert.match(wins[0].match,/组六/);
 assert.equal(api.scanEntryForDraw({id:'x',original:text,amount:result.amount},target,'334').length,0);checks++;
}
const missing=api.autoCalculateBet('34569五米');assert.deepEqual([missing.amount,missing.confident],[5,false]);
const explicit=api.scanEntryForDraw({id:'x',original:'福34569组三五米',amount:5},'福彩','334');assert.equal(explicit.length,1,JSON.stringify({explicit,result:api.autoCalculateBet('福34569组三五米')}));
console.log(`IMPLICIT_GROUP6 passed=${checks+2}`);

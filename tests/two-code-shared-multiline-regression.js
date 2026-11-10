const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api = Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null},setItem(){}},{getElementById:element,querySelectorAll(){return []},createElement:element},()=>false,{});
const cases=[];
for(const lottery of ['福','体','体彩排列三']) for(const play of ['组三','组六']) {
  for(const rate of ['1倍','10元']) {
    cases.push([`${lottery}12\n34\n56\n78${play}${rate}`,40]);
    cases.push([`${lottery}12\n34\n56\n78\n${play}${rate}`,40]);
    cases.push([`${lottery}${play}12\n34\n56\n78各${rate}`,40]);
  }
}
cases.push(['福12\n34\n56\n78两码组三各5元\n共20',20],['福体12\n34\n56\n78组三1倍',80]);
for(const [text,amount] of cases){const result=api.autoCalculateBet(text); assert.deepEqual([result.amount,result.confident],[amount,true],JSON.stringify({text,result,expected:amount}));}
const original='体12\n34\n56\n78组三各10元';
assert.equal(api.scanEntryForDraw({id:'pair-rows',original,amount:40},'体彩','121').length,1);
assert.equal(api.scanEntryForDraw({id:'pair-rows',original,amount:40},'福彩','121').length,0);
assert.equal(api.scanEntryForDraw({id:'pair-rows',original,amount:40},'体彩','123').length,0);
console.log(`TWO_CODE_SHARED_MULTILINE passed=${cases.length}`);

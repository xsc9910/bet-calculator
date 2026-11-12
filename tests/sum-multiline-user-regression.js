const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null},setItem(){}},{getElementById:el,querySelectorAll(){return []},createElement:el},()=>false,{});
const text='3D和值\\\n26\\\n27\\\n各1倍合计20';
let checks=0;
for(const [lottery,target,factor] of [['3D','福彩',1],['福','福彩',1],['体彩','体彩',1],['福体','福彩',2]]) for(const rate of ['1倍','10元']) for(const slash of ['', '\\']) {
 const input=`${lottery}和值${slash}\n26${slash}\n27${slash}\n各${rate}合计${20*factor}`;
 const result=api.autoCalculateBet(input);
 assert.deepEqual([result.amount,result.claimed,result.confident],[20*factor,20*factor,true],JSON.stringify({input,result}));
 for(const draw of ['998','999','123']) {
   const actual=api.scanEntryForDraw({id:'sum',original:input,amount:result.amount},target,draw);
   const expected=[26,27].flatMap(sum=>api.scanEntryForDraw({id:'separate',original:`${target}和值${sum}各${rate}`,amount:10},target,draw));
   assert.deepEqual(actual.map(w=>[w.match,w.stake,w.prize]),expected.map(w=>[w.match,w.stake,w.prize]),JSON.stringify({input,draw,actual,expected}));
 }
 checks++;
}
assert.equal(api.autoCalculateBet(text).amount,20);
const wrong=api.autoCalculateBet(text.replace('20','30'));
assert.deepEqual([wrong.amount,wrong.claimed],[20,30]);
console.log(`SUM_MULTILINE passed=${checks+2}`);

const fs=require('fs');
const assert=require('assert/strict');
const element=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:element,querySelectorAll(){return [];},createElement:element},()=>false,{});
const original=`体
269  279 282  287  467  476
477  927  962  926  972二直
269  962  926五直
2*9  9*2  92*各10
福
800  803  805  808  823  826
827  828  728  708  827  846一直
828  808五直
80*   8*0各10
合计168`;
const cases=[[original,168,168],[original.replace('合计168','合计160'),168,160]];
for(const lottery of ['福','体']) {
 for(const wildcard of ['*','x','X']) {
  for(const price of ['各10','各10米','各打5元']) {
   const stake=price==='各打5元'?5:10;
   const row=`2${wildcard}9 9${wildcard}2 92${wildcard}${price}`;
   cases.push([`${lottery}\n269 279\n282二直\n${row}`,12+3*stake,'']);
   cases.push([`${lottery}\n${row}\n269 279\n282二直`,12+3*stake,'']);
  }
 }
}
cases.push(['福\n827 827一直\n80* 8*0各10',24,'']);
for(const [text,amount,claimed] of cases) {
 const result=api.autoCalculateBet(text);
 assert.deepEqual([result.amount,result.claimed,result.confident],[amount,claimed,true],JSON.stringify({text,result}));
}
console.log(`MIXED_WILDCARD_168 passed=${cases.length}`);

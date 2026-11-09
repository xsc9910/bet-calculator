const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
for(const [text,amount,lottery,direct,group] of [
 ['234福3+2米',5,'福彩',3,2],['234福10+10米',20,'福彩',10,10],['福234 10+10米',20,'福彩',10,10],['福234 十+十元',20,'福彩',10,10],['234体0.5＋2元',2.5,'体彩',0.5,2],['234福3十2米',5,'福彩',3,2]
 ,['234福1+1',4,'福彩',2,2],['234福1+1元',2,'福彩',1,1],['234福10+10',40,'福彩',20,20],['福234 3+2',10,'福彩',6,4],['234体0.5＋2',5,'体彩',1,4],['234福1+1倍',4,'福彩',2,2]
]){
 const result=api.autoCalculateBet(text);assert.equal(result.amount,amount,JSON.stringify({text,result}));
 const wins=api.scanEntryForDraw({id:'compact',original:text,amount},lottery,'234');assert.equal(wins.find(w=>w.match.includes('直选'))?.stake,direct,JSON.stringify({text,wins}));assert.equal(wins.find(w=>w.match.includes('组六单式'))?.stake,group,JSON.stringify({text,wins}));
}
let checks=0;
for(const [marker,targets] of [['福',['福彩']],['体',['体彩']],['福体',['福彩','体彩']]]) for(const number of ['234','964','522']) for(const [direct,group] of [[3,2],[10,10],[0.5,2],[15,8]]) for(const symbol of ['+','＋']) for(const order of ['before','after']) {
 const text=order==='before'?`${marker}${number} ${direct}${symbol}${group}米`:`${number}${marker}${direct}${symbol}${group}米`;
 const amount=(direct+group)*targets.length,result=api.autoCalculateBet(text);
 assert.equal(result.amount,amount,JSON.stringify({text,result}));
 for(const lottery of ['福彩','体彩']){
  const wins=api.scanEntryForDraw({id:'matrix',original:text,amount},lottery,number),own=targets.includes(lottery);
  assert.equal(wins.find(w=>w.match.startsWith('直选'))?.stake||0,own?direct:0,JSON.stringify({text,lottery,wins}));
  assert.equal(wins.find(w=>w.match.includes('单式'))?.stake||0,own?group:0,JSON.stringify({text,lottery,wins})); checks++;
 }
}
for(const [text,amount] of [['234 235福3+2米',10],['福234+235 10+10米',40],['234福3+2米\n567体10+10米\n合计25',25]]) {
 const result=api.autoCalculateBet(text);assert.equal(result.amount,amount,JSON.stringify({text,result}));
}
for(const [lottery,draw,direct,group] of [['福彩','234',3,2],['体彩','567',10,10],['福彩','567',0,0],['体彩','234',0,0]]) {
 const text='234福3+2米\n567体10+10米\n合计25',wins=api.scanEntryForDraw({id:'mixed',original:text,amount:25},lottery,draw);
 assert.equal(wins.find(w=>w.match.startsWith('直选'))?.stake||0,direct,JSON.stringify({lottery,draw,wins}));
 assert.equal(wins.find(w=>w.match.includes('单式'))?.stake||0,group,JSON.stringify({lottery,draw,wins}));
}
for(const [marker,targets] of [['福',['福彩']],['体',['体彩']],['福体',['福彩','体彩']]]) for(const number of ['234','964','522']) for(const [direct,group] of [[1,1],[3,2],[10,10],[0.5,2]]) for(const symbol of ['+','＋']) for(const order of ['before','after']) {
 const text=order==='before'?`${marker}${number} ${direct}${symbol}${group}`:`${number}${marker}${direct}${symbol}${group}`;
 const amount=2*(direct+group)*targets.length,result=api.autoCalculateBet(text);
 assert.equal(result.amount,amount,JSON.stringify({text,result}));
 for(const lottery of ['福彩','体彩']){
  const wins=api.scanEntryForDraw({id:'multiple',original:text,amount},lottery,number),own=targets.includes(lottery);
  assert.equal(wins.find(w=>w.match.startsWith('直选'))?.stake||0,own?2*direct:0,JSON.stringify({text,lottery,wins}));
  assert.equal(wins.find(w=>w.match.includes('单式'))?.stake||0,own?2*group:0,JSON.stringify({text,lottery,wins}));checks++;
 }
}
for(const text of ['234福1+','234福+1','234福1+不详','234福1元+1']) {
 const result=api.autoCalculateBet(text);assert.ok(!result.confident || result.amount==='',JSON.stringify({text,result}));
}
for(const [text,amount] of [['234福1+1\n567体2+3\n合计14',14],['234 235福1+1',8],['福234+235 1+1',8]]) {
 const result=api.autoCalculateBet(text);assert.equal(result.amount,amount,JSON.stringify({text,result}));
}
{const result=api.autoCalculateBet('234福1+1合计6');assert.equal(result.amount,4);assert.equal(result.claimed,6);}
console.log(JSON.stringify({checks,failures:0}));
console.log('COMPACT_PLUS_RATE passed');

const fs = require('fs');
const assert = require('assert/strict');
const element=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw,parseAdjacentNumberPlaySegments};')({getItem(){return null;},setItem(){}},{getElementById:element,querySelectorAll(){return [];},createElement:element},()=>false,{});
const original='福605一单一组506一单合计6';
console.log(JSON.stringify(api.autoCalculateBet(original)));
const cases=[[original,6,6]];
for (const lottery of ['福','体','福体']) {
 const factor=lottery==='福体'?2:1;
 for(const separator of ['', ' ', '，', '\n', '；']) {
  for(const [first,second,amount] of [['一单一组','一单',6],['一组一直','二直',8],['三直两组','一组',12],[' 1单2组',' 2单',10],['直1米组2米','直0.5米',3.5],['一组','三单',8]]) {
   cases.push([`${lottery}605${first}${separator}506${second}`,amount*factor,'']);
  }
 }
}
cases.push(
 ['福605 606一单一组506 507一单合计12',12,12],
 ['福605一单一组605一单合计6',6,6],
 ['福605一单一组\n体506一单合计6',6,6],
 ['福体605一单一组体506一单合计10',10,10],
 ['福605一单一组506一单合计99',6,99],
 ['福605一单一组506一单112三组',12,''],
 ['体605各1个单2个组506各2个单',10,''],
 ['福000一直一组111一单',6,''],
 ['体605组3元506直4元',7,'']
);
for(const [text,amount,claimed] of cases) {
 const result=api.autoCalculateBet(text);
 assert.deepEqual([result.amount,result.claimed,result.confident],[amount,claimed,true],JSON.stringify({text,result}));
}
for (const [text,lottery,draw,expected] of [
 [original,'福彩','605',[[2,1900],[2,310]]],
 [original,'福彩','506',[[2,310],[2,1900]]],
 [original,'福彩','650',[[2,310]]],
 [original,'福彩','505',[]],
 [original,'体彩','605',[]],
 ['福605一单一组\n体506一单','福彩','506',[[2,310]]],
 ['福605一单一组\n体506一单','体彩','506',[[2,1900]]],
 ['福605一单一组605一单','福彩','605',[[2,1900],[2,310],[2,1900]]],
 ['福112三组121一单','福彩','121',[[6,1860],[2,1900]]],
 ['福605直1米组2米506直0.5米','福彩','506',[[2,310],[0.5,475]]]
]) {
 const wins=api.scanEntryForDraw({id:'adjacent',original:text,amount:api.autoCalculateBet(text).amount},lottery,draw);
 assert.deepEqual(wins.map(win=>[win.stake,win.prize]),expected,JSON.stringify({text,lottery,draw,wins}));
}
for(const text of ['福605一单一组506','福605一单一组506一单双飞56','福605一单一组506一单未知','福6051单5061单','福605一单一组体','福605一单一组506组三一米']) {
 assert.equal(api.parseAdjacentNumberPlaySegments(text),null,text);
}
console.log(`ADJACENT_NUMBER_PLAY passed=${cases.length} plus payout/scope checks`);

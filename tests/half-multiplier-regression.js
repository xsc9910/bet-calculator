const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value:'', checked:false, options:[], style:{}, classList:{toggle(){},add(){},remove(){}}, replaceChildren(){}, append(){}, setAttribute(){} });
const api = Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')(
  {getItem(){return null;},setItem(){}}, {getElementById:element,querySelectorAll(){return [];},createElement:element}, () => false, {}
);
const original = '299 922 422 244 455 544 522 022 200 099 900 688 255 181 818 448 884 866 332 772体组半倍20元';
console.log(JSON.stringify(api.autoCalculateBet(original)));
let checks = 0;
const failures = [];
function verify(text, expected, claimed, lottery, draw, prize) {
  const result = api.autoCalculateBet(text);
  checks++;
  if (result.amount !== expected || !result.confident || (claimed !== undefined && result.claimed !== claimed)) failures.push({type:'amount',text,expected,claimed,result});
  if (lottery && draw) {
    const wins = api.scanEntryForDraw({id:'half',original:text,amount:expected},lottery,draw);
    const actual = wins.reduce((sum,win) => sum+win.prize,0);
    checks++;
    if (actual !== prize) failures.push({type:'prize',text,lottery,draw,expected:prize,actual,wins});
  }
}
verify(original,20,20,'体彩','299',310);
verify(original,20,20,'福彩','299',0);
verify(original.replace('20元','21元'),20,21);
const examples = [
  ['体299 922组半倍',2,'体彩','299',310],
  ['福299 922直半倍',2,'福彩','299',950],
  ['福体299 922组半倍',4,'福彩','299',310],
  ['福299 922直组各半倍',4,'福彩','299',1260],
  ['福123转圈半倍',6,'福彩','321',950],
  ['体1234组六半倍',5,'体彩','123',190],
  ['福1234组三半倍',5,'福彩','112',130],
  ['福独胆3半倍',5,'福彩','123',17.5],
  ['体23双飞半倍',5,'体彩','123',85],
  ['福和值6半倍',5,'福彩','123',160],
  ['体跨度2半倍',5,'体彩','123',49]
];
for (const [text,amount,lottery,draw,prize] of examples) verify(text,amount,undefined,lottery,draw,prize);
for (const [marker, lotteries, factor] of [['福',['福彩'],1],['体',['体彩'],1],['福体',['福彩','体彩'],2]]) {
  for (const separator of [' ', '，', '-', '\n']) {
    for (const play of ['直','组']) {
      for (const half of ['半倍','半 倍','0.5倍']) {
        const numbers = ['299','299','922'].join(separator);
        for (const text of [`${marker}${numbers}${play}${half}`,`${numbers}${marker}${play}${half}`,`${marker}${play}${half}\n${numbers}`]) {
          const expectedPrize = 2 * (play === '直' ? 950 : 310);
          for (const lottery of ['福彩','体彩']) verify(text,3*factor,undefined,lottery,'299',lotteries.includes(lottery)?expectedPrize:0);
        }
      }
    }
  }
}
verify('福299直半倍 922组半倍',2,undefined,'福彩','299',950);
verify('福299直半倍 体922组半倍',2,undefined,'体彩','299',0);
verify('福299直半倍 体922组半倍',2,undefined,'体彩','922',310);
console.log(JSON.stringify({checks,failures:failures.length,examples:failures.slice(0,20)},null,2));
if (failures.length) process.exitCode = 1;

const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value:'', checked:false, options:[], style:{}, classList:{toggle(){},add(){},remove(){}}, replaceChildren(){}, append(){}, setAttribute(){} });
const api = Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')(
  {getItem(){return null;},setItem(){}}, {getElementById:element,querySelectorAll(){return [];},createElement:element}, () => false, {}
);
const original = `502 503 501 508 523
521 528 531 538 518
951 952 953 958 923
913 928 938 918 958
福一直一组
782 784 785 780 724
725 720 745 740 750
802 804 805 806 824
825 826 845 846 856
排一直一组
共160`;
console.log(JSON.stringify(api.autoCalculateBet(original)));
let checks=0;
function verify(text,parts,claimed) {
  const expected = parts.reduce((sum, part) => sum + part.numbers.length * (part.direct + part.group) * part.games.length, 0);
  const result = api.autoCalculateBet(text);
  assert.equal(result.amount,expected,JSON.stringify({text,result,expected}));
  assert.equal(result.confident,true,JSON.stringify({text,result}));
  if (claimed !== undefined) assert.equal(result.claimed,claimed);
  checks++;
  for(const lottery of ['福彩','体彩']) for(const draw of ['001','112','123','321','456','654','455']) {
    let prize=0;
    for(const part of parts) if(part.games.includes(lottery)) for(const number of part.numbers) {
      if(number===draw) prize+=part.direct*950;
      if(new Set(draw).size>1 && [...number].sort().join('')===[...draw].sort().join('')) prize+=part.group*(new Set(draw).size===2?310:155);
    }
    const wins=api.scanEntryForDraw({id:'trailing-play',record:91,lotteries:['福彩'],original:text,amount:expected},lottery,draw);
    assert.equal(wins.reduce((sum,win)=>sum+win.prize,0),prize,JSON.stringify({text,lottery,draw,wins,prize}));
    checks++;
  }
}
const result=api.autoCalculateBet(original);
assert.deepEqual([result.amount,result.claimed,result.confident],[160,160,true]);
for(const [lottery,draw,expected] of [['福彩','958',4420],['体彩','958',0],['福彩','782',0],['体彩','782',2210]]) {
  const wins=api.scanEntryForDraw({id:'trailing-play',lotteries:['福彩'],original,amount:160},lottery,draw);
  assert.equal(wins.reduce((sum,win)=>sum+win.prize,0),expected,JSON.stringify({lottery,draw,wins})); checks++;
}
assert.equal(api.autoCalculateBet(original.replace('共160','共161')).amount,160);
assert.equal(api.autoCalculateBet(original.replace('共160','共161')).claimed,161);
for(const [firstMarker,firstGames,secondMarker,secondGames] of [['福',['福彩'],'排',['体彩']],['体',['体彩'],'福彩',['福彩']],['福体',['福彩','体彩'],'体',['体彩']]]) {
  for(const [play,direct,group] of [['一直一组',2,2],['一组一直',2,2],['直组各1元',1,1],['三单两组',6,4],['直半倍',1,0],['组半倍',0,1]]) {
    for(const sep of [' ','，','\n']) {
      const first=['001','123','001'], second=['456','455','654'];
      const text=`${first.join(sep)}\n${firstMarker}${play}\n${second.join(sep)}\n${secondMarker}${play}\n共999`;
      verify(text,[{numbers:first,games:firstGames,direct,group},{numbers:second,games:secondGames,direct,group}],999);
    }
  }
}
for(const text of [original+'\n未知99元',original+'\n777']) assert.equal(api.autoCalculateBet(text).confident,false,text);
console.log(JSON.stringify({checks:checks+5,failures:0}));

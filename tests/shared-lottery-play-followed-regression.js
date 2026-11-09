const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value:'', checked:false, options:[], style:{}, classList:{toggle(){},add(){},remove(){}}, replaceChildren(){}, append(){}, setAttribute(){} });
const api = Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')(
  {getItem(){return null;},setItem(){}}, {getElementById:element,querySelectorAll(){return [];},createElement:element}, () => false, {}
);
const original = `福703 704 706 613 615 634 735 956 957 
体612 613 614 715 716 724 824 924 726 
直组1米

福730 3直
体742 1直
共44`;
console.log(JSON.stringify(api.autoCalculateBet(original)));
let checks=0;
function verify(text,parts,claimed) {
  const amount=parts.reduce((sum,part)=>sum+part.numbers.length*(part.direct+part.group)*part.games.length,0);
  const result=api.autoCalculateBet(text);
  assert.equal(result.amount,amount,JSON.stringify({text,result,amount}));
  assert.equal(result.confident,true,JSON.stringify({text,result}));
  if(claimed!==undefined)assert.equal(result.claimed,claimed);
  checks++;
  for(const lottery of ['福彩','体彩'])for(const draw of ['001','100','123','321','456','654','455','730','742']){
    let expected=0;
    for(const part of parts)if(part.games.includes(lottery))for(const number of part.numbers){
      if(number===draw)expected+=part.direct*950;
      if(new Set(draw).size>1&&[...number].sort().join('')===[...draw].sort().join(''))expected+=part.group*(new Set(draw).size===2?310:155);
    }
    const wins=api.scanEntryForDraw({id:'shared',record:72,original:text,amount},lottery,draw);
    assert.equal(wins.reduce((sum,win)=>sum+win.prize,0),expected,JSON.stringify({text,lottery,draw,expected,wins}));
    assert.equal(new Set(wins.map(win=>win.id)).size,wins.length);
    for(const win of wins)assert.equal(win.record,72);
    checks++;
  }
}
const result=api.autoCalculateBet(original);
assert.deepEqual([result.amount,result.claimed,result.confident],[44,44,true]);
for(const [lottery,draw,expected] of [['福彩','703',1105],['体彩','703',0],['福彩','612',0],['体彩','612',1105],['福彩','730',5855],['体彩','730',0],['体彩','742',2055]]){
  const wins=api.scanEntryForDraw({id:'shared',original,amount:44},lottery,draw);
  assert.equal(wins.reduce((sum,win)=>sum+win.prize,0),expected,JSON.stringify({lottery,draw,wins}));checks++;
}
assert.deepEqual([api.autoCalculateBet(original.replace('共44','共45')).amount,api.autoCalculateBet(original.replace('共44','共45')).claimed],[44,45]);
for(const [marker1,games1,marker2,games2] of [['福',['福彩'],'体',['体彩']],['体',['体彩'],'福',['福彩']],['福体',['福彩','体彩'],'排',['体彩']]]){
  for(const [rate,direct,group] of [['直组1米',1,1],['直组各半倍',1,1],['一直一组',2,2],['组1元直2元',2,1]]){
    for(const sep of [' ','，','-'])for(const gap of ['\n','\n\n']){
      const a=['001','123','001'],b=['456','455','654'];
      const text=`${marker1}${a.join(sep)}${gap}${marker2}${b.join(sep)}\n${rate}\n福730 3直\n体742 1直\n共999`;
      verify(text,[{numbers:a,games:games1,direct,group},{numbers:b,games:games2,direct,group},{numbers:['730'],games:['福彩'],direct:6,group:0},{numbers:['742'],games:['体彩'],direct:2,group:0}],999);
    }
  }
}
const mixed=original.replace('共44','体1234组六10元\n共54');
assert.equal(api.autoCalculateBet(mixed).amount,54);
const poolWins=api.scanEntryForDraw({id:'mixed',original:mixed,amount:54},'体彩','123');
assert.equal(poolWins.reduce((sum,win)=>sum+win.prize,0),380);
assert.equal(api.autoCalculateBet(original+'\n未知玩法99元').confident,false);
console.log(JSON.stringify({checks:checks+4,failures:0}));

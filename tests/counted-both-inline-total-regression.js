const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value:'', checked:false, options:[], style:{}, classList:{toggle(){},add(){},remove(){}}, replaceChildren(){}, append(){}, setAttribute(){} });
const api = Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')(
  {getItem(){return null;},setItem(){}}, {getElementById:element,querySelectorAll(){return [];},createElement:element}, () => false, {}
);
const original='232 223 455 667一直一组16元';
console.log(JSON.stringify(api.autoCalculateBet(original)));
let checks=0;
function verify(text,numbers,games,claimed) {
  const expectedAmount=numbers.length*4*games.length;
  const result=api.autoCalculateBet(text);
  assert.deepEqual([result.amount,result.claimed,result.confident],[expectedAmount,claimed,true],JSON.stringify({text,result}));checks++;
  for(const lottery of ['福彩','体彩'])for(const draw of ['232','322','455','667','123','321','000']){
    let expected=0;
    if(games.includes(lottery))for(const number of numbers){
      if(number===draw)expected+=1900;
      if(new Set(draw).size>1&&[...number].sort().join('')===[...draw].sort().join(''))expected+=new Set(draw).size===2?620:310;
    }
    const wins=api.scanEntryForDraw({id:'inline-total',record:19,original:text,amount:999},lottery,draw);
    assert.equal(wins.reduce((sum,win)=>sum+win.prize,0),expected,JSON.stringify({text,lottery,draw,expected,wins}));
    for(const win of wins){assert.equal(win.stake,2,JSON.stringify({text,win}));assert.equal(win.record,19);}
    checks++;
  }
}
verify(original,['232','223','455','667'],['福彩'],16);
verify(original.replace('16元','17元'),['232','223','455','667'],['福彩'],17);
for(const [marker,games] of [['',['福彩']],['福',['福彩']],['三弟',['福彩']],['福彩3D',['福彩']],['体',['体彩']],['排三',['体彩']],['福体',['福彩','体彩']]]){
  for(const play of ['一直一组','一单一组','一组一直','一组一单'])for(const separator of [' ','，','-','+','×']){
    for(const numbers of [['232','223','455','667'],['123','123','321'],['000','232']]){
      const claimed=numbers.length*4*games.length;
      verify(`${marker}${numbers.join(separator)}${play}${claimed}元`,numbers,games,claimed);
    }
  }
}
for(const separator of ['\n','；',' ']){
  const text=`福${original}${separator}体123一直一组4元\n共20`;
  const result=api.autoCalculateBet(text);
  assert.deepEqual([result.amount,result.claimed,result.confident],[20,20,true],JSON.stringify({text,result}));
  for(const [lottery,draw,expected] of [['福彩','232',3140],['体彩','232',0],['福彩','123',0],['体彩','123',2210]]){
    const wins=api.scanEntryForDraw({id:'mixed-total',original:text,amount:20},lottery,draw);
    assert.equal(wins.reduce((sum,win)=>sum+win.prize,0),expected,JSON.stringify({text,lottery,draw,wins}));checks++;
  }
}
console.log(JSON.stringify({checks,failures:0}));

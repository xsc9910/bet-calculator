const fs=require('fs');
const assert=require('assert/strict');
const element=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const app=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:element,querySelectorAll(){return [];},createElement:element},()=>false,{});
const failures=[];
let checks=0;
function check(text,amount,draw,stake,lottery='福彩'){
 checks++;
 const result=app.autoCalculateBet(text);
 if(!result.confident||result.amount!==amount)failures.push({text,amount,result});
 if(draw){
  checks++;
  const wins=app.scanEntryForDraw({id:'two-code-order',original:text,amount},lottery,draw);
  const actual=Number(wins.reduce((sum,win)=>sum+win.prize,0).toFixed(2));
  if(actual!==stake*155)failures.push({text,draw,expected:stake*155,actual,wins});
 }
}
for(const code of ['23','47','08'])for(const label of ['组三两码','两码组三','组三二码','二码组三','组三2码','2码组三','组三']) {
 for(const [rate,stake] of [['',10],['一倍',10],['2倍',20],['10元',10],['20',20],['0.5米',0.5]]){
  for(const source of [`${code} ${label}${rate}`,`${label}${code} ${rate==='20'?'各20':rate}`,`${code}\n${label}${rate}`]){
   check(source,stake,code[0]+code,stake);
   check(`体${source}`,stake,code+code[1],stake,'体彩');
  }
 }
}
check('福23 47组三两码各10元',20,'223',10);
check('福23组三两码\n体47两码组三\n合计20',20);
check('23组三两码福',10,'233',10);
check('福体23组三两码',20,'223',10);
check('福23组三两码',10,'234',0);
check('福23组三两码',10,'222',0);
check('福23组三两码合计99',10,'223',10);
assert.equal(app.autoCalculateBet('福23组三两码合计99').claimed,99);
console.log(JSON.stringify({checks,failures:failures.length}));
for(const failure of failures.slice(0,8))console.log(JSON.stringify(failure));
assert.equal(failures.length,0);

const fs=require('fs');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
const failures=[];let cases=0,checks=0;
for(const [lottery,targets] of [['福',['福彩']],['体',['体彩']],['福体',['福彩','体彩']],['三弟',['福彩']]]) for(const [code,kind] of [['47','two'],['05','two'],['29','two'],['123','three'],['069','three'],['579','three'],['112','repeat'],['008','repeat']]) for(const [rate,money] of [['10元',10],['1倍',kind==='repeat'?2:10],['0.5米',0.5]]) {
 const variants=[`${code}组三${rate}`,`组三${code} ${rate}`,`${code} ${rate}组三`,`${rate}组三${code}`,`组三${rate} ${code}`];
 for(const text of variants.map(s=>lottery+s)){
  const expected=money*targets.length,result=api.autoCalculateBet(text);cases++;
  if(!result.confident||result.amount!==expected)failures.push({kind:'amount',text,expected,result});
  const digits=[...new Set(code)], hit=kind==='repeat'?code:digits[0]+digits[0]+digits[1],miss=kind==='repeat'?digits[0]+digits[1]+digits[1]:'999';
  for(const target of ['福彩','体彩']) for(const draw of [hit,miss]){
   const wins=api.scanEntryForDraw({id:'audit-group3',original:text,amount:expected},target,draw),actual=wins.reduce((s,w)=>s+w.prize,0);
   const correct=draw===hit&&targets.includes(target)?money*(kind==='two'?155:kind==='three'?53:310):0;checks++;
   if(Math.abs(actual-correct)>1e-8)failures.push({kind:'prize',text,target,draw,expected:correct,actual,wins});
  }
 }
}
for(const [text,amount,lottery,draw,expected] of [
 ['福47组三10',10,'福彩','447',1550],['体123组三10',10,'体彩','112',530],['福112组三10',10,'福彩','121',3100],
 ['福47 47组三各10元',20,'福彩','447',3100],['福47 58组三各10元',20,'福彩','558',1550],
 ['福47组三10元 123组三10元 共20',20,'福彩','447',1550],['福47组三10元 123组三10元 共20',20,'福彩','112',530],
 ['体47组三10元 福123组三1倍 共20',20,'体彩','447',1550],['体47组三10元 福123组三1倍 共20',20,'福彩','112',530]
]){
 const result=api.autoCalculateBet(text),wins=api.scanEntryForDraw({id:'mixed-group3',original:text,amount},lottery,draw),actual=wins.reduce((s,w)=>s+w.prize,0);cases++;checks++;
 if(result.amount!==amount||!result.confident||actual!==expected)failures.push({kind:'mixed',text,lottery,draw,expected,actual,result,wins});
}
fs.mkdirSync('tests/reports',{recursive:true});fs.writeFileSync('tests/reports/two-three-group3-order-audit.json',JSON.stringify({cases,checks,failures},null,2));
console.log(JSON.stringify({cases,checks,failures:failures.length,examples:failures.slice(0,10)},null,2));if(failures.length)process.exitCode=1;

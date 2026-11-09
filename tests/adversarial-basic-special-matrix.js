const fs=require('fs');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
const specs=[
 ['独胆','2','234','135',3.5,d=>d.includes('2')],['双飞','27','278','234',17,d=>d.includes('2')&&d.includes('7')],
 ['和值','6','123','124',32,d=>[...d].reduce((s,x)=>s+Number(x),0)===6],['跨度','4','145','123',6.5,d=>Math.max(...d)-Math.min(...d)===4],
 ['组六','1234','123','125',38,d=>new Set(d).size===3&&[...d].every(x=>'1234'.includes(x))],
 ['组三','1234','112','115',26,d=>new Set(d).size===2&&[...d].every(x=>'1234'.includes(x))],
 ['对子','2','122','100',32,d=>[...d].filter(x=>x==='2').length>=2]
];
let cases=0,checks=0;const failures=[];
for(const [play,pick,hit,miss,odds,match] of specs)for(const separator of ['\n','，',' '])for(const flip of [false,true]){
 const basic='234 6元直 组2元',special=`${pick} 10元${play}`;
 const text=flip?`体${special}${separator}福${basic} 共18`:`福${basic}${separator}体${special} 共18`;
 const result=api.autoCalculateBet(text);cases++;if(!result.confident||result.amount!==18||result.claimed!==18)failures.push({kind:'amount',text,result});
 for(const [lottery,draw,expected] of [['福彩','234',6010],['福彩','432',310],['体彩',hit,match(hit)?10*odds:0],['体彩',miss,match(miss)?10*odds:0]]){
  const wins=api.scanEntryForDraw({id:'mixed',original:text,amount:18},lottery,draw),actual=wins.reduce((s,w)=>s+w.prize,0);checks++;
  if(Math.abs(actual-expected)>1e-8)failures.push({kind:'prize',text,lottery,draw,expected,actual,wins});
 }
}
for(const [play,pick,hit,miss,odds,match] of specs)for(const separator of ['\n','，','；',' '])for(const flip of [false,true]){
 const basic='234 6元直 组2元',special=`${pick} 10元${play}`;
 const text=`福${flip?special+separator+basic:basic+separator+special} 共18`;
 const result=api.autoCalculateBet(text);cases++;if(!result.confident||result.amount!==18||result.claimed!==18)failures.push({kind:'same-amount',text,result});
 for(const draw of new Set(['234','432',hit,miss])){
  const expected=(draw==='234'?5700:0)+([...draw].sort().join('')==='234'?310:0)+(match(draw)?10*odds:0);
  const wins=api.scanEntryForDraw({id:'same',original:text,amount:18},'福彩',draw),actual=wins.reduce((s,w)=>s+w.prize,0);checks++;
  if(Math.abs(actual-expected)>1e-8)failures.push({kind:'same-prize',text,draw,expected,actual,wins});
 }
}
fs.mkdirSync('tests/reports',{recursive:true});fs.writeFileSync('tests/reports/adversarial-basic-special-matrix.json',JSON.stringify({cases,checks,failures},null,2));
console.log(JSON.stringify({cases,checks,failures:failures.length,examples:failures.slice(0,12)},null,2));if(failures.length)process.exitCode=1;

const fs=require('fs');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
const cases=[];for(let i=0;i<10;i++)for(let j=i+1;j<10;j++)cases.push({code:`${i}${j}`,kind:'two'});
for(const code of ['012','123','234','345','456','567','678','789','089','019'])cases.push({code,kind:'three'});
for(let i=0;i<10;i++)cases.push({code:`${i}${i}${(i+1)%10}`,kind:'repeat'});
let checks=0,failures=0;const examples=[];
for(const {code,kind} of cases){
 const amount=kind==='repeat'?2:10,text=`福${code}组三1倍`,result=api.autoCalculateBet(text);
 if(!result.confident||result.amount!==amount){failures++;if(examples.length<10)examples.push({text,result,amount});}
 for(let n=0;n<1000;n++){
  const draw=String(n).padStart(3,'0'),unique=new Set(draw),hit=kind==='repeat'?[...draw].sort().join('')===[...code].sort().join(''):unique.size===2&&[...draw].every(d=>code.includes(d));
  const expected=hit?(kind==='two'?1550:kind==='three'?530:620):0,wins=api.scanEntryForDraw({id:'group3-draws',original:text,amount},'福彩',draw),actual=wins.reduce((s,w)=>s+w.prize,0);checks++;
  if(actual!==expected){failures++;if(examples.length<10)examples.push({text,draw,expected,actual,wins});}
 }
}
console.log(JSON.stringify({selections:cases.length,drawChecks:checks,failures,examples}));if(failures)process.exitCode=1;

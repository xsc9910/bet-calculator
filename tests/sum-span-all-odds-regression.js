const fs=require('fs');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
const sums=[8000,3100,1580,940,610,420,320,250,200,160,140,130,120,115,115,120,130,140,160,200,250,320,420,610,940,1580,3100,8000];
const spans=[800,175,98,75,65,63,65,75,98,175];
const failures=[];let checks=0;
for(const [label,lottery,rates] of [['和值','福彩',sums],['跨度','体彩',spans]]) for(let number=0;number<rates.length;number++){
 const text=`${lottery}${label}${number}一倍`,result=api.autoCalculateBet(text);
 if(!result.confident||result.amount!==10)failures.push({type:'amount',text,result});
 for(let n=0;n<1000;n++){
  const draw=String(n).padStart(3,'0'),values=[...draw].map(Number);
  const hit=label==='和值'?values.reduce((a,b)=>a+b,0)===number:Math.max(...values)-Math.min(...values)===number;
  const expected=hit?rates[number]:0,wins=api.scanEntryForDraw({id:'odds',original:text,amount:10},lottery,draw);
  const actual=wins.reduce((s,w)=>s+w.prize,0);if(actual!==expected&&failures.length<100)failures.push({type:'prize',text,draw,expected,actual});checks++;
 }
}
console.log(JSON.stringify({plays:38,drawChecks:checks,failures:failures.length,examples:failures.slice(0,10)}));if(failures.length)process.exitCode=1;

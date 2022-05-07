const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const app=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
let seed=197703,checks=0;const failures=[];
const rand=n=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n;};
const round=n=>Number(n.toFixed(2));
function check(kind,text,amount,draws=[]){
 const result=app.autoCalculateBet(text);checks++;
 if(!result.confident||result.amount!==round(amount))failures.push({kind,text,amount,result});
 for(const [lottery,draw,expected] of draws){checks++;const wins=app.scanEntryForDraw({id:'generated',original:text,amount},lottery,draw);const actual=round(wins.reduce((s,w)=>s+w.prize,0));if(actual!==round(expected))failures.push({kind:kind+' payout',text,lottery,draw,expected:round(expected),actual,wins});}
}
for(let i=0;i<48;i++){
 const n=String(rand(1000)).padStart(3,'0');const reverse=n.split('').reverse().join('');
 const a=[.2,.5,1,2,3][rand(5)],b=[.5,1,2,4][rand(4)];const groupOdds=new Set(n).size===3?155:new Set(n).size===2?310:0;
 for(const separator of ['\n','；']){
  check('separate games',`福${n}直组${a}米${separator}体${reverse}直组${b}米`,2*(a+b),[['福彩',n,a*(950+groupOdds)],['体彩',reverse,b*(950+groupOdds)]]);
  check('independent same game',`福${n}直组${a}米${separator}${reverse}直组${b}米`,2*(a+b),[['福彩',n,a*(950+groupOdds)+b*((n===reverse?950:0)+groupOdds)]]);
  for(const text of [`福直组${a}米${n}${separator}体直组${b}米${reverse}`,`福${a}元直选${a}元组选 ${n}${separator}体${b}元直选${b}元组选 ${reverse}`,`福${n}直选${a}米组选${a}米${separator}体${reverse}组选${b}米直选${b}米`])check('play order mixed games',text,2*(a+b),[['福彩',n,a*(950+groupOdds)],['体彩',reverse,b*(950+groupOdds)]]);
 }
 check('same line comma',`福${n}直组${a}米，体${reverse}直组${b}米`,2*(a+b),[['福彩',n,a*(950+groupOdds)],['体彩',reverse,b*(950+groupOdds)]]);
 const pair=[rand(10),rand(10)];if(pair[0]===pair[1])pair[1]=(pair[1]+1)%10;
 const code=pair.join('');const price=[.5,10,20,50][rand(4)];
 check('two code default',`${code}组三两码`,10,[['福彩',`${pair[0]}${code}`,1550],['福彩',`${pair[0]}`.repeat(3),0]]);
 check('two code cash',`体${code}两码组三${price}元`,price,[['体彩',`${code}${pair[1]}`,price*155],['福彩',`${code}${pair[1]}`,0]]);
 const pool='012589',other='134568';
 check('shared tail',`福${pool}\n体${other}组六${price}元合计999`,price*2,[['福彩','129',price*7.9],['体彩','129',0],['体彩','346',price*7.9]]);
}
for(const separator of ['\n','；'])for(const pair of [['福123直组1米','体456直组2米'],['福123直组1米','456直组2米']]){
 const text=pair.join(separator)+'\n不认识玩法99元';checks++;assert.equal(app.autoCalculateBet(text).confident,false,text);
}
fs.mkdirSync('tests/reports',{recursive:true});fs.writeFileSync('tests/reports/generated-composition.json',JSON.stringify({seed:197703,checks,failures},null,2));
console.log(JSON.stringify({checks,failures:failures.length,kinds:[...new Set(failures.map(f=>f.kind))]}));failures.slice(0,6).forEach(f=>console.log(JSON.stringify(f)));assert.equal(failures.length,0);

const fs=require('fs');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
const specs=[
 {name:'独胆',pick:'2',play:'独胆',hit:'234',miss:'135',odds:3.5,match:d=>d.includes('2')},
 {name:'双飞',pick:'27',play:'双飞',hit:'278',miss:'234',odds:17,match:d=>d.includes('2')&&d.includes('7')},
 {name:'和值',pick:'6',play:'和值',hit:'123',miss:'124',odds:32,match:d=>[...d].reduce((s,x)=>s+Number(x),0)===6},
 {name:'跨度',pick:'4',play:'跨度',hit:'145',miss:'123',odds:6.5,match:d=>Math.max(...d)-Math.min(...d)===4},
 {name:'组六',pick:'1234',play:'组六',hit:'123',miss:'125',odds:38,match:d=>new Set(d).size===3&&[...d].every(x=>'1234'.includes(x))},
 {name:'组三',pick:'1234',play:'组三',hit:'112',miss:'115',odds:26,match:d=>new Set(d).size===2&&[...d].every(x=>'1234'.includes(x))},
 {name:'对子',pick:'2',play:'对子',hit:'122',miss:'100',odds:32,match:d=>[...d].filter(x=>x==='2').length>=2}
];
const failures=[];let cases=0,checks=0;
for(const left of specs)for(const right of specs)for(const separator of ['\n','，',' ']){
 const l=`${left.pick} 10元${left.play}`,r=`${right.play}5元 ${right.pick}`,text=`福${l}${separator}体${r} 共15`;
 const result=api.autoCalculateBet(text);cases++;if(!result.confident||result.amount!==15||result.claimed!==15)failures.push({kind:'amount',text,result});
 for(const [lottery,spec,stake] of [['福彩',left,10],['体彩',right,5]])for(const draw of [spec.hit,spec.miss]){
  const wins=api.scanEntryForDraw({id:'special-mixed',original:text,amount:15},lottery,draw),actual=wins.reduce((s,w)=>s+w.prize,0),expected=spec.match(draw)?stake*spec.odds:0;checks++;
  if(Math.abs(actual-expected)>1e-8)failures.push({kind:'prize',text,lottery,draw,expected,actual,wins});
 }
}
for(const left of specs)for(const right of specs)for(const separator of ['\n','，','；',' ','']){
 const l=`${left.pick} 10元${left.play}`,r=`${right.play}5元 ${right.pick}`,text=`福${l}${separator}${r} 共15`;
 const result=api.autoCalculateBet(text);cases++;if(!result.confident||result.amount!==15||result.claimed!==15)failures.push({kind:'same-lottery-amount',text,result});
 for(const draw of new Set([left.hit,left.miss,right.hit,right.miss])){
  const wins=api.scanEntryForDraw({id:'same-lottery',original:text,amount:15},'福彩',draw),actual=wins.reduce((s,w)=>s+w.prize,0),expected=(left.match(draw)?10*left.odds:0)+(right.match(draw)?5*right.odds:0);checks++;
  if(Math.abs(actual-expected)>1e-8)failures.push({kind:'same-lottery-prize',text,draw,expected,actual,wins});
 }
}
for(const text of ['福2 10元独胆 双飞27','福2 10元独胆 双飞','福2 10元独胆 3双飞','福2 10元独胆 双飞不详','福2 10元独胆 体3双飞','福2 10元独胆 体双飞27']){
 const result=api.autoCalculateBet(text);cases++;if(result.confident&&result.amount!=='')failures.push({kind:'incomplete',text,result});
}
for(const marker of ['三弟','福彩3D']){
 const text=`${marker}2 10元独胆 体双飞5元 27 共15`,result=api.autoCalculateBet(text);cases++;
 if(!result.confident||result.amount!==15)failures.push({kind:'alias-scope-amount',text,result});
 for(const [lottery,draw,expected] of [['福彩','234',35],['体彩','278',85],['体彩','234',0]]){
  const wins=api.scanEntryForDraw({id:'alias-scope',original:text,amount:15},lottery,draw),actual=wins.reduce((s,w)=>s+w.prize,0);checks++;
  if(actual!==expected)failures.push({kind:'alias-scope-prize',text,lottery,draw,expected,actual,wins});
 }
}
fs.mkdirSync('tests/reports',{recursive:true});fs.writeFileSync('tests/reports/adversarial-special-mixed-matrix.json',JSON.stringify({cases,checks,failures},null,2));
console.log(JSON.stringify({cases,checks,failures:failures.length,examples:failures.slice(0,12)},null,2));if(failures.length)process.exitCode=1;

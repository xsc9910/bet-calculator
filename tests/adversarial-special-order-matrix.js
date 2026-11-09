const fs=require('fs');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
const specs=[
 {name:'独胆',pick:'2',play:'独胆',hit:'234',miss:'135',odds:3.5},
 {name:'双飞',pick:'27',play:'双飞',hit:'278',miss:'234',odds:17},
 {name:'和值',pick:'6',play:'和值',hit:'123',miss:'124',odds:32},
 {name:'跨度',pick:'4',play:'跨度',hit:'145',miss:'123',odds:6.5},
 {name:'组六',pick:'1234',play:'组六',hit:'123',miss:'125',odds:38},
 {name:'组三',pick:'1234',play:'组三',hit:'112',miss:'115',odds:26},
 {name:'对子',pick:'2',play:'对子',hit:'122',miss:'100',odds:32},
];
const failures=[];let cases=0,checks=0;
for(const [marker,target] of [['福','福彩'],['体','体彩'],['三弟','福彩'],['福彩3D','福彩']]) for(const spec of specs) for(const [rate,stake] of [['2元',2],['10元',10],['0.5元',0.5],['1倍',10],['3倍',30],['半倍',5]]){
 const {pick,play,hit,miss,odds}=spec;
 const forms=[`${pick}${play}${rate}`,`${play}${pick}打${rate}`,`${pick} ${rate}${play}`,`${rate}${play}${pick}`,`${play}${rate} ${pick}`,`${rate} ${pick}${play}`];
 for(const form of forms)for(const text of [`${marker}${form}`,`${form}${marker}`]){
  const result=api.autoCalculateBet(text);cases++;if(!result.confident||result.amount!==stake)failures.push({kind:'amount',name:spec.name,text,expected:stake,result});
  for(const draw of [hit,miss]){
   const wins=api.scanEntryForDraw({id:'special-order',original:text,amount:stake},target,draw),actual=wins.reduce((s,w)=>s+w.prize,0),expected=draw===hit?stake*odds:0;checks++;
   if(Math.abs(actual-expected)>1e-8)failures.push({kind:'prize',name:spec.name,text,draw,expected,actual,wins});
  }
 }
}
fs.mkdirSync('tests/reports',{recursive:true});fs.writeFileSync('tests/reports/adversarial-special-order-matrix.json',JSON.stringify({cases,checks,failures},null,2));
console.log(JSON.stringify({cases,checks,failures:failures.length,examples:failures.slice(0,15)},null,2));if(failures.length)process.exitCode=1;

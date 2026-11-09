const fs=require('fs');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
const failures=[];let cases=0,checks=0;
for(const [lottery,target] of [['福','福彩'],['体','体彩']]) for(const stake of [0.5,10,30]){
 const specs=[
  {label:'一码定位',position:'百位8',hit:'812',miss:'712',odds:9.5},
  {label:'两码定位',position:'百位8个位1',hit:'831',miss:'832',odds:95}
 ];
 for(const {label,position,hit,miss,odds} of specs){
  const forms=[`${label}${position}打${stake}元`,`${position}${label}${stake}元`,`${position} ${stake}元${label}`,`${stake}元${label}${position}`,`${label}${stake}元 ${position}`,`${stake}元 ${position}${label}`];
  for(const form of forms)for(const text of [`${lottery}${form}`,`${form}${lottery}`]){
   const result=api.autoCalculateBet(text);cases++;if(!result.confident||result.amount!==stake)failures.push({kind:'amount',text,expected:stake,result});
   for(const draw of [hit,miss]){
    const wins=api.scanEntryForDraw({id:'position-order',original:text,amount:stake},target,draw),actual=wins.reduce((s,w)=>s+w.prize,0),expected=draw===hit?stake*odds:0;checks++;
    if(Math.abs(actual-expected)>1e-8)failures.push({kind:'prize',text,draw,expected,actual,wins});
   }
  }
 }
}
for(const [text,amount,lottery,draw,expected] of [
 ['福两码定位百位8个位69 2倍',40,'福彩','836',1900],
 ['福一码定位百位85个位69 0.5元',2,'福彩','806',9.5],
 ['福一码定位个位08 5倍',100,'福彩','128',475],
 ['福百位8 0.5元一码定位 体2 10元独胆 共10.5',10.5,'福彩','812',4.75],
 ['福百位8 0.5元一码定位 体2 10元独胆 共10.5',10.5,'体彩','812',35]
]){
 const result=api.autoCalculateBet(text),wins=api.scanEntryForDraw({id:'multi-pos',original:text,amount},lottery,draw),actual=wins.reduce((s,w)=>s+w.prize,0);cases++;checks++;
 if(result.amount!==amount||actual!==expected)failures.push({kind:'multi-position',text,expectedAmount:amount,result,expected,actual,wins});
}
fs.mkdirSync('tests/reports',{recursive:true});fs.writeFileSync('tests/reports/adversarial-position-order-matrix.json',JSON.stringify({cases,checks,failures},null,2));
console.log(JSON.stringify({cases,checks,failures:failures.length,examples:failures.slice(0,12)},null,2));if(failures.length)process.exitCode=1;

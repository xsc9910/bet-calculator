const fs=require('fs');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
const failures=[];let checks=0;
function check(text,amount,expected){
 const result=api.autoCalculateBet(text);if(!result.confident||result.amount!==amount)failures.push({type:'amount',text,result,expected:amount});
 for(let n=0;n<1000;n++){
  const draw=String(n).padStart(3,'0'),wins=api.scanEntryForDraw({id:'coverage',original:text,amount},'福彩',draw),actual=wins.reduce((s,w)=>s+w.prize,0),expectedPrize=expected(draw);checks++;
  if(actual!==expectedPrize&&failures.length<50)failures.push({type:'prize',text,draw,expected:expectedPrize,actual});
 }
}
for(let digit=0;digit<10;digit++){
 check(`福${digit}对子10元`,10,draw=>[...draw].filter(x=>x===String(digit)).length>=2?320:0);
 check(`福对子${digit}一倍`,10,draw=>[...draw].filter(x=>x===String(digit)).length>=2?320:0);
}
const rates={4:145,5:75,6:43,7:25,8:18,9:12};
for(let size=4;size<=9;size++){
 const digits='012345678'.slice(0,size);check(`福${digits}复试10元`,10,draw=>[...draw].every(digit=>digits.includes(digit))?rates[size]:0);
}
console.log(JSON.stringify({drawChecks:checks,failures:failures.length,examples:failures.slice(0,12)}));if(failures.length)process.exitCode=1;

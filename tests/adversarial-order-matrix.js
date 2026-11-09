const fs=require('fs');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
const failures=[];let cases=0,checks=0;
function check(text,amount,targets,number,direct,group){
 cases++;const result=api.autoCalculateBet(text);
 if(!result.confident||result.amount!==amount) failures.push({kind:'amount',text,expected:amount,result});
 for(const lottery of ['福彩','体彩']) for(const draw of [number,[...number].reverse().join(''),'999']){
  const wins=api.scanEntryForDraw({id:'adversarial',original:text,amount},lottery,draw);
  const expected=targets.includes(lottery)?(draw===number?direct*950:0)+([...draw].sort().join('')===[...number].sort().join('')&&new Set(draw).size>1?group*(new Set(draw).size===2?310:155):0):0;
  const actual=wins.reduce((s,w)=>s+w.prize,0);checks++;if(actual!==expected)failures.push({kind:'prize',text,lottery,draw,expected,actual,wins});
 }
}
for(const [marker,targets] of [['福',['福彩']],['体',['体彩']],['福体',['福彩','体彩']],['三弟',['福彩']],['福彩3D',['福彩']]]) for(const number of ['234','005','678']) for(const [direct,group] of [[6,2],[0.5,3],[10,10]]) for(const punctuation of [' ','，','；']) {
 const choices=[`${direct}元直${punctuation}组${group}元`,`${direct}元直${punctuation}${group}元组`,`直${direct}元${punctuation}${group}元组`,`${group}元组${punctuation}直${direct}元`,`${group}元组选${punctuation}${direct}元直选`];
 for(const rates of choices)for(const text of [`${marker}${number} ${rates}`,`${number}${marker}${rates}`,`${marker}${rates}\n${number}`])check(text,(direct+group)*targets.length,targets,number,direct,group);
}
for(const [marker,targets] of [['福',['福彩']],['体',['体彩']],['福体',['福彩','体彩']]]) for(const text of [`${marker}234 3倍直 组1倍`,`${marker}234 1倍组 3倍直`,`${marker}直3倍 1倍组\n234`,`${marker}234 半倍直 组2倍`]){
 const half=text.includes('半倍'),direct=half?1:6,group=half?4:2;
 check(text,(direct+group)*targets.length,targets,'234',direct,group);
}
for(const text of ['福234 6元直 组','福234 6元直 组不详','福2346元直 组2元']){
 const result=api.autoCalculateBet(text);cases++;if(result.confident&&result.amount!=='')failures.push({kind:'ambiguity',text,result});
}
fs.mkdirSync('tests/reports',{recursive:true});fs.writeFileSync('tests/reports/adversarial-order-matrix.json',JSON.stringify({cases,checks,failures},null,2));
console.log(JSON.stringify({cases,checks,failures:failures.length,examples:failures.slice(0,12)},null,2));if(failures.length)process.exitCode=1;

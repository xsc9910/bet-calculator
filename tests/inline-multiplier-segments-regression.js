const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
const original='三弟 434直3倍 344  443  直各一倍 885直3倍 588  858直各一倍一共20';
let checks=0;const failures=[];
function check(text,amount,lottery,draw,prize){const result=api.autoCalculateBet(text);checks++;if(result.amount!==amount||!result.confident)failures.push({text,amount,result});if(draw){checks++;const wins=api.scanEntryForDraw({id:'inline',original:text,amount},lottery,draw);const actual=wins.reduce((s,w)=>s+w.prize,0);if(actual!==prize)failures.push({text,lottery,draw,prize,actual,wins});}}
check(original,20,'福彩','434',5700);
for(const alias of ['福','福彩','3D','三D','三地','三弟','体','排列三'])for(const sep of [' ', '，','；','\n'])for(const [a,b] of [[1,2],[3,1],[2,5]]){
 const source=`${alias}013直${a}倍${sep}310 031直选各${b}倍${sep}112组${a}倍${sep}121组各${b}倍`;
 const amount=(2*a+3*b)*2;const target=/体|排/.test(alias)?'体彩':'福彩';
 check(source,amount,target,'013',a*1900);
 check(source,amount,target,'121',(a+b)*620);
 check(source,amount,target==='福彩'?'体彩':'福彩','013',0);
}
check('三弟434直3倍体344直一倍',8,'福彩','344',0);
check('福434直3倍434直1倍',8,'福彩','434',7600);
check(original.replace('一共20','一共99'),20,'福彩','858',1900);
assert.equal(api.autoCalculateBet(original.replace('一共20','一共99')).claimed,99);
console.log(JSON.stringify({checks,failures:failures.length}));failures.slice(0,5).forEach(f=>console.log(JSON.stringify(f)));assert.equal(failures.length,0);

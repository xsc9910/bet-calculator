const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw,calculate};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
const cases=[
 ['体5拖1436组六100组三20',120,'体彩','513',1550],
 ['体5拖1436组六100组三20',120,'体彩','553',620],
 ['体5拖1436组六100组三20',120,'体彩','143',0],
 ['福1拖456组六10',10,'福彩','123',0],
 ['福1拖456组六10',10,'福彩','145',258],
 ['福3拖125678\n1拖234679组六各40组三20',120,'福彩','312',584],
 ['福3拖125678\n1拖234679组六各40组三20',120,'福彩','113',860],
];
let failed=0;for(const [text,amount,lottery,draw,expected] of cases){const result=api.autoCalculateBet(text);const wins=api.scanEntryForDraw({id:'dan-regression',original:text,amount},lottery,draw);const actual=wins.reduce((a,w)=>a+w.prize,0);if(result.amount!==amount||actual!==expected){failed++;console.log('FAIL',JSON.stringify({text,draw,expected,result,wins,actual}));}}console.log(JSON.stringify({cases:cases.length,failed}));if(failed)process.exitCode=1;
const scenarios=[
 {text:'体5拖1436组六100组三20',amount:120,parts:[['体彩','5','1436','组六',100,155],['体彩','5','1436','组三',20,310]]},
 {text:'福3拖125678\n1拖234679组六各40组三20',amount:120,parts:[['福彩','3','125678','组六',40,73],['福彩','3','125678','组三',20,215],['福彩','1','234679','组六',40,73],['福彩','1','234679','组三',20,215]]},
 {text:'福彩拖码456胆码1组六10\n体彩胆5拖1436组三20',amount:30,parts:[['福彩','1','456','组六',10,258],['体彩','5','1436','组三',20,310]]},
 {text:'福1托456组六10',amount:10,parts:[['福彩','1','456','组六',10,258]]}
];
let checked=0;for(const scenario of scenarios) for(const lottery of ['福彩','体彩']) for(let n=0;n<1000;n++){
 const draw=String(n).padStart(3,'0'),digits=[...draw],unique=new Set(digits);
 const expected=scenario.parts.reduce((sum,[target,dan,drag,play,stake,odds])=>sum+((target===lottery&&unique.size===(play==='组三'?2:3)&&[...dan].every(d=>digits.includes(d))&&digits.every(d=>(dan+drag).includes(d)))?stake*odds/10:0),0);
 const wins=api.scanEntryForDraw({id:'all-draws',original:scenario.text,amount:scenario.amount},lottery,draw);
 const actual=wins.reduce((sum,win)=>sum+win.prize,0);
 assert.equal(actual,expected,JSON.stringify({text:scenario.text,lottery,draw,expected,wins})); checked++;
}
console.log(JSON.stringify({drawChecks:checked,failures:0}));
for(const pickText of ['1拖456','1456']) for(const [draw,prize] of [['145',258],['456',0],['123',0]]) {
 const result=api.calculate({playKey:'group6Dan',draw,pickText,stake:10});assert.equal(result.prize,prize,JSON.stringify({pickText,draw,result}));
}
const uncertain=api.scanEntryForDraw({id:'uncertain',original:'福1拖456组三组六5元',amount:5},'福彩','145');
assert.equal(uncertain.length,1);assert.match(uncertain[0].match,/金额分配待确认/);assert.equal(uncertain[0].prize,0);

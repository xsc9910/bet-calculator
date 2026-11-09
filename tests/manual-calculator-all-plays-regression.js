const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {calculate,scanEntryForDraw,autoCalculateBet};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
for(const [lottery,amount,expected] of [['福彩',10,35],['体彩',180,600]]) {
 const manual=api.calculate({lottery,playKey:'group3Pack',draw:'122',pickText:'',stake:amount});
 assert.equal(manual.prize,expected,JSON.stringify({lottery,manual,expected}));
 const text=`${lottery}组三全包一倍`,result=api.autoCalculateBet(text);assert.equal(result.amount,amount,JSON.stringify({text,result}));
 const wins=api.scanEntryForDraw({id:'same-game',original:text,amount},lottery,'122');assert.equal(wins.reduce((sum,w)=>sum+w.prize,0),expected,JSON.stringify({lottery,wins}));
}
const digits=draw=>[...draw],unique=draw=>new Set(draw).size,pool=(draw,values,n)=>unique(draw)===n&&digits(draw).every(d=>values.includes(d));
const sumRates=[8000,3100,1580,940,610,420,320,250,200,160,140,130,120,115,115,120,130,140,160,200,250,320,420,610,940,1580,3100,8000];
const spanRates=[800,175,98,75,65,63,65,75,98,175];
const specs=[
 ['direct','012',2,d=>d==='012'?1900:0],
 ['group6','123',2,d=>unique(d)===3&&[...d].sort().join('')==='123'?310:0],
 ['group3','122',2,d=>unique(d)===2&&[...d].sort().join('')==='122'?620:0],
 ['group6Multi','1234',10,d=>pool(d,'1234',3)?380:0],
 ['group3Multi','1234',10,d=>pool(d,'1234',2)?260:0],
 ['directMulti','1234',10,d=>digits(d).every(x=>'1234'.includes(x))?145:0],
 ['leopardPack','',10,d=>unique(d)===1?800:0],
 ['singleDigit','1',10,d=>d.includes('1')?35:0],
 ['doubleFly','12',10,d=>d.includes('1')&&d.includes('2')?170:0],
 ['pair','2',10,d=>digits(d).filter(x=>x==='2').length>=2?320:0],
 ['pos1','百1',10,d=>d[0]==='1'?95:0],
 ['pos2','百1十2',10,d=>d[0]==='1'&&d[1]==='2'?950:0],
 ['sum','6',10,d=>digits(d).reduce((s,x)=>s+Number(x),0)===6?sumRates[6]:0],
 ['span','4',10,d=>Math.max(...digits(d).map(Number))-Math.min(...digits(d).map(Number))===4?spanRates[4]:0],
 ['circle6','1234',48,d=>pool(d,'1234',3)?1900:0],
 ['circle3','1234',72,d=>pool(d,'1234',2)?1900:0],
 ['group6Dan','1拖234',10,d=>d.includes('1')&&pool(d,'1234',3)?258:0],
 ['group3Dan','1拖234',10,d=>d.includes('1')&&pool(d,'1234',2)?385:0],
 ['sticky6','1',72,d=>unique(d)===3&&d.includes('1')?300:0],
 ['sticky3','1',36,d=>unique(d)===2&&d.includes('1')?600:0],
 ['group3Pack','',10,d=>unique(d)===2?35:0]
];
let checks=0;for(const [playKey,pickText,stake,expected] of specs) for(let n=0;n<1000;n++){
 const draw=String(n).padStart(3,'0'),result=api.calculate({lottery:'福彩',playKey,draw,pickText,stake});
 assert.equal(result.prize,expected(draw),JSON.stringify({playKey,draw,result,expected:expected(draw)}));checks++;
}
assert.equal(api.calculate({lottery:'福彩',playKey:'custom',draw:'123',pickText:'',stake:10,customBase:2,customPrize:6,customHits:3}).prize,90);
console.log(JSON.stringify({plays:specs.length,drawChecks:checks,failures:0}));
console.log('MANUAL_CALCULATOR_ALL_PLAYS passed');

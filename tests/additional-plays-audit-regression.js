const fs=require('fs');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
const cases=[
 ['福2对子10元',10,'福彩','122',320],['福2对子10元',10,'福彩','100',0],['福2对子10元',10,'福彩','110',0],
 ['福对子2一倍',10,'福彩','122',320],['体2、3对子各5元',10,'体彩','233',160],['体2、3对子各5元',10,'体彩','100',0],
 ['福组三全包一倍',10,'福彩','122',35],['福组三全包一倍',10,'福彩','123',0],
 ['体胆1粘边赖组六两倍',144,'体彩','123',600],['体胆1粘边赖组六两倍',144,'体彩','234',0],
 ['福1234复试10元',10,'福彩','112',145],['福1234复试10元',10,'福彩','125',0],
 ['福234复试一倍',12,'福彩','234',1900],['福234复试一倍',12,'福彩','244',0]
];
let failed=0;for(const [text,amount,lottery,draw,expected] of cases){const result=api.autoCalculateBet(text),wins=api.scanEntryForDraw({id:'additional',original:text,amount},lottery,draw),actual=wins.reduce((s,w)=>s+w.prize,0);if(result.amount!==amount||actual!==expected){failed++;console.log('FAIL',JSON.stringify({text,draw,expected,result,wins}));}}
for(const [text,amount,expected] of [
 ['福2对子10元',10,draw=>[...draw].filter(d=>d==='2').length>=2?320:0],
 ['福1234复试10元',10,draw=>[...draw].every(d=>'1234'.includes(d))?145:0],
 ['福组三全包一倍',10,draw=>new Set(draw).size===2?35:0],
 ['体胆1粘边赖组六两倍',144,draw=>new Set(draw).size===3&&draw.includes('1')?600:0]
]) for(let n=0;n<1000;n++){
 const draw=String(n).padStart(3,'0'),lottery=text.startsWith('体')?'体彩':'福彩',wins=api.scanEntryForDraw({id:'more-draws',original:text,amount},lottery,draw),actual=wins.reduce((s,w)=>s+w.prize,0);
 if(actual!==expected(draw)){failed++;if(failed<=10)console.log('FAIL',JSON.stringify({text,draw,expected:expected(draw),wins}));}
}
console.log(JSON.stringify({cases:cases.length,failures:failed}));if(failed)process.exitCode=1;

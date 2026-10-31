const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
const original=`234579组六30米组三10米
452   594   698   298   098组3米单2米共25米

370   795  793   792   560   794   727   796   352   782
786    组4米单1米共55米

070  050   250   352   790
470    592   574   593   580
939  562   472  505   909   858
585   797  789直组各一米共38米共158米  福`;
console.log(JSON.stringify(api.autoCalculateBet(original)));
const cases=[[original,158,158],['福452 594 698 298 098组3米单2米共25米',25,25],['体370 795\n793组4米单1米共15米',15,15]];
for(const lottery of ['福','体'])for(const sep of ['\n','\n\n'])for(const [g,d] of [[3,2],[.5,1],[6,.2]])for(const order of [`组${g}米单${d}米`,`单${d}米组${g}米`,`组选${g}元直选${d}元`]){
 const amount=Number((40+3*(g+d)+4).toFixed(2));
 cases.push([`${lottery}234579组六30米组三10米${sep}452 594${sep}098${order}共${3*(g+d)}米${sep}070 050直组1米共4米共${amount}米`,amount,amount]);
}
let checks=0;for(const [text,amount,claimed] of cases){const result=api.autoCalculateBet(text);assert.deepEqual([result.amount,result.claimed,result.confident],[amount,claimed,true],JSON.stringify({text,result}));checks++;}
for(const [draw,expected] of [['452',30*7.9+2*950+3*155],['370',950+4*155],['070',950+310],['233',105],['234',30*7.9],['352',237+950+4*155+950+155]]){
 const wins=api.scanEntryForDraw({id:'original158',original,amount:158},'福彩',draw);assert.equal(Number(wins.reduce((s,w)=>s+w.prize,0).toFixed(2)),expected,JSON.stringify({draw,wins}));checks++;
}
assert.equal(api.autoCalculateBet(original.replace('共158米','共999米')).amount,158);
assert.equal(api.autoCalculateBet(original.replace('共158米','共999米')).claimed,999);
assert.equal(api.scanEntryForDraw({id:'wrong-lottery',original,amount:158},'体彩','452').length,0);
assert.equal(api.autoCalculateBet(original+'\n未知玩法99元').confident,false);
console.log(JSON.stringify({checks:checks+4,failures:0}));

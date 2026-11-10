const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
const original='3D：1-3-5-6胆拖02489组六各10元\n共40';
const cases=[[original,40,40],['福1-3拖02489组六各10元',20,''],['福1~3拖02489组六各10元',30,''],['体1-3-5-6胆托02489组三各5元',20,'']];
for(const [text,amount,claimed] of cases){const result=api.autoCalculateBet(text);assert.deepEqual([result.amount,result.claimed,result.confident],[amount,claimed,true],JSON.stringify({text,result}));}
for(const marker of ['福','体','福体','3D','福彩3D','福3D','三弟']) for(const separator of ['-','、',',',' ','']) for(const word of ['拖','托','胆拖','胆托','拖码']) for(const position of ['before','after','middle']){
 const digits=['1','3','5','6'].join(separator), core=`${digits}${word}02489组六各10元`, text=position==='before'?`${marker}：${core}`:position==='after'?`${core}${marker}`:`${digits}${word}02489组六${marker}各10元`;
 const result=api.autoCalculateBet(text),expected=marker==='福体'?80:40;
 assert.equal(result.confident,true,JSON.stringify({text,result}));assert.equal(result.amount,expected,JSON.stringify({text,result}));
}
for(const [draw,expected] of [['102',103],['302',103],['502',103],['602',103],['024',0],['900',0]]){
 const wins=api.scanEntryForDraw({id:'shared-dantuo',original,amount:40},'福彩',draw);
 assert.equal(wins.reduce((s,w)=>s+w.prize,0),expected,JSON.stringify({draw,wins}));
}
console.log('MULTI_DAN_DANTUO_SEPARATORS passed');

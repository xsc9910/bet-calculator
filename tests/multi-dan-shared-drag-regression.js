const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
const tests=[['1 2拖345678各10元',20],['1~2拖34677各10米',20],['福1 2拖345678组六各10元',20],['体1~2拖34677组三各10米',20]];
for(const [text,expected] of tests){const result=api.autoCalculateBet(text);console.log(JSON.stringify({text,expected,result}));assert.equal(result.amount,expected,JSON.stringify({text,result}));}
for(const [marker,target,factor] of [['福','福彩',1],['体','体彩',1],['福体','福彩',2]]) for(const sep of [' ','、',',','~','～','-']) for(const play of ['组三','组六']) {
 const text=`${marker}1${sep}2拖345678${play}各10元`;const result=api.autoCalculateBet(text);
 assert.equal(result.amount,20*factor,JSON.stringify({text,result}));
 for(const [draw,expected] of play==='组六'?[['134',73],['234',73],['123',0],['345',0]]:[['113',215],['223',215],['334',0]]) {
  const wins=api.scanEntryForDraw({id:'shared',original:text,amount:result.amount},target,draw);
  assert.equal(wins.reduce((sum,win)=>sum+win.prize,0),expected,JSON.stringify({text,draw,wins,expected}));
 }
}
for(const [text,amount] of [['福1~4拖56789组六各10元',40],['体1 2 3托4567组三各5米',15],['福体1~2拖34677各10米',40]]) assert.equal(api.autoCalculateBet(text).amount,amount,text);
const original=api.autoCalculateBet('1~2拖34677各10米');assert.match(original.reasons.join(''),/未注明组三或组六/);
assert.equal(api.scanEntryForDraw({id:'missing-play',original:'1~2拖34677各10米',amount:20},'福彩','137').length,0);
console.log('MULTI_DAN_SHARED_DRAG passed');

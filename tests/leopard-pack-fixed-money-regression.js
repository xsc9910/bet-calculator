const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
for(const [marker,targets] of [['福',['福彩']],['体',['体彩']],['福体',['福彩','体彩']]]) for(const [play,stake] of [['豹子全包10米',10],['豹子全包20元',20],['豹子全包1元',1],['豹子全包一倍',10],['豹子全包2倍',20],['豹子全包各1米',10],['豹子各1米',10]]) {
 const text=marker+play,amount=stake*targets.length,result=api.autoCalculateBet(text);
 assert.equal(result.amount,amount,JSON.stringify({text,result}));
 for(const lottery of ['福彩','体彩']) {
  const wins=api.scanEntryForDraw({id:'pack',original:text,amount},lottery,'111');
  assert.equal(wins.reduce((sum,win)=>sum+win.prize,0),targets.includes(lottery)?stake*80:0,JSON.stringify({text,lottery,wins}));
 }
}
for(const [text,expected] of [['豹子全包10米',10],['福豹子全包0.5元',0.5],['福豹子全包五毛',0.5],['体彩豹子全包各2元',20],['福豹子各1元',10]]) {
 const result=api.autoCalculateBet(text);assert.equal(result.amount,expected,JSON.stringify({text,result}));
}
{const result=api.autoCalculateBet('福豹子全包10米合计100');assert.equal(result.amount,10);assert.equal(result.claimed,100);}
for(const text of ['福豹子全包10米\n123一直一组\n合计14','福123一直一组\n豹子全包10米\n合计14']){
 const result=api.autoCalculateBet(text);assert.equal(result.amount,14,JSON.stringify({text,result}));
 const wins=api.scanEntryForDraw({id:'mixed',original:text,amount:14},'福彩','111');assert.equal(wins.reduce((s,w)=>s+w.prize,0),800,JSON.stringify({text,wins}));
}
for(let n=0;n<1000;n++){
 const draw=String(n).padStart(3,'0'),text='福豹子全包10米';
 const wins=api.scanEntryForDraw({id:'draws',original:text,amount:10},'福彩',draw);
 assert.equal(wins.reduce((sum,win)=>sum+win.prize,0),new Set(draw).size===1?800:0,JSON.stringify({draw,wins}));
}
console.log('LEOPARD_PACK_FIXED_MONEY passed');

const fs=require('fs');
const assert=require('assert/strict');
const element=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw,parseSharedDirectGroupRates};')({getItem(){return null;},setItem(){}},{getElementById:element,querySelectorAll(){return [];},createElement:element},()=>false,{});
const cases=[];
for(const lottery of ['福','体','福体']) {
 const factor=lottery==='福体'?2:1;
 for(const play of ['直选组选','组选直选','直选 组选','直选、组选','直选和组选']) {
  for(const [rate,per] of [['各1倍',4],['各一米',2],['各0.5元',1]]) {
   cases.push([`${lottery}605 506${play}${rate}`,2*per*factor]);
   cases.push([`${lottery}${play}${rate}\n605 506`,2*per*factor]);
   cases.push([`605 506\n${play}${rate}${lottery}`,2*per*factor]);
  }
 }
 for(const [play,per] of [['直选2元组选1元',3],['组选1米直选3米',4],['直选三倍组选两倍',10],['一直一组',4],['一组一直',4]]) {
  cases.push([`${lottery}605 506${play}`,2*per*factor]);
  cases.push([`${lottery}${play}\n605 506`,2*per*factor]);
 }
 cases.push([`${lottery}605直选1元506组选2元`,3*factor]);
 cases.push([`${lottery}605一直一组506一直`,6*factor]);
}
let failures=0;
cases.push(['福605 605直选三倍组选两倍',20],['福605直选三倍组选两倍\n体506直选一倍组选两倍\n合计16',16],['福605 506直选三倍组选两倍合计8',20]);
for(const [text,amount] of cases){
 const result=api.autoCalculateBet(text);
 if(result.amount!==amount||!result.confident){failures++;if(failures<=25)console.log(JSON.stringify({text,amount,result}));}
}
console.log({cases:cases.length,failures});
assert.equal(failures,0);
assert.equal(api.autoCalculateBet('福605 506直选三倍组选两倍合计8').claimed,8);
for (const [source,lottery,draw,expected] of [
 ['福605 506直选三倍组选两倍','福彩','605',[[6,5700],[4,620],[4,620]]],
 ['福605 506直选三倍组选两倍','福彩','650',[[4,620],[4,620]]],
 ['福直选三倍组选两倍\n605 506','福彩','605',[[6,5700],[4,620],[4,620]]],
 ['福一直一组\n605 506','福彩','605',[[2,1900],[2,310],[2,310]]],
 ['体605 506组选1米直选3米','体彩','605',[[3,2850],[1,155],[1,155]]],
 ['福112 121直选2元组选1元','福彩','112',[[2,1900],[1,310],[1,310]]],
 ['福605 605直选2元组选1元','福彩','605',[[2,1900],[1,155],[2,1900],[1,155]]],
 ['福605 506直选三倍组选两倍','体彩','605',[]],
 ['福605 506直选三倍组选两倍','福彩','555',[]],
 ['福605直选1元506组选2元','福彩','506',[[2,310]]],
 ['福605直选1元506组选2元','福彩','605',[[1,950],[2,310]]]
]) {
 const wins=api.scanEntryForDraw({id:'full-plays',original:source,amount:api.autoCalculateBet(source).amount},lottery,draw);
 assert.deepEqual(wins.map(win=>[win.stake,win.prize]),expected,JSON.stringify({source,lottery,draw,wins}));
}
for(const text of ['福605直选1元506组选2元','福605直选1元体506组选2元','福605直选2元组选','福605直选2元组选1元双飞56','福605直选2元组选1元506']) assert.equal(api.parseSharedDirectGroupRates(text),null,text);
console.log('FULL_DIRECT_GROUP_NAMES payout and scope checks passed');

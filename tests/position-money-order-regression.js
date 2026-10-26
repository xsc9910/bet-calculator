const fs = require('fs');
const assert = require('assert/strict');
const element=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw,parseThreePositionTrailingMoney};')({getItem(){return null;},setItem(){}},{getElementById:element,querySelectorAll(){return [];},createElement:element},()=>false,{});
const original='体\n百02468\n十02468\n个02468一米125';
console.log('Original:',JSON.stringify(api.autoCalculateBet(original)));
const cases=[[original,125,125]];
for(const lottery of ['福','体','福体']) {
  const factor=lottery==='福体'?2:1;
  for(const [rate,stake] of [['一米',1],['0.5元',0.5],['五毛',0.5],['两块',2]]) {
    for(const rateText of [rate,`各打${rate}`,`每注${rate}`,`打${rate}`,`记${rate}`,`${rate}钱`]) {
      for(const source of [`${lottery}${rateText}\n百01\n十23\n个45`,`${lottery}百01\n十23\n个45 ${rateText}。`,`${lottery}百01 十23 ${rateText}\n个45`,`${lottery}百01 十23 个45 ${rateText}${8*stake*factor}米`]) {
        cases.push([source,8*stake*factor,source.endsWith('米')&&/\d米$/.test(source)?8*stake*factor:'']);
      }
    }
  }
}
let failures=0;
cases.push(
 ['体一米\n百02468\n十02468\n个02468合计125',125,125],
 ['体百02468 十02468 个02468记一米120',125,120],
 ['福百01 十23 个45一倍',16,''],
 ['福百01 十23 个45两倍',32,''],
 ['福百01 十23 个45各一米\n体百67 十89 个01各0.5米\n合计12',12,12],
 ['体每注五毛\n个位45\n百位01\n十位23',4,''],
 ['体百01\n十23\n个45\n直选每注1元共99',8,99]
);
for(const [text,amount,claimed] of cases){
 const result=api.autoCalculateBet(text);
 if(result.amount!==amount || !result.confident || result.claimed!==claimed){
  failures++; if(failures<=12) console.log(JSON.stringify({text,amount,claimed,result}));
 }
}
console.log({cases:cases.length,failures});
assert.equal(failures,0);
for(const [original,lottery,draw,stakes] of [
 ['体一米\n百02468\n十02468\n个02468合计125','体彩','024',[1]],
 ['体记五毛\n百01\n十23\n个45','体彩','024',[0.5]],
 ['体百01 十23一米\n个45','体彩','024',[1]],
 ['体百01 十23一米\n个45','体彩','124',[1]],
 ['体百01 十23一米\n个45','体彩','226',[]],
 ['体百01 十23一米\n个45','福彩','024',[]],
 ['体百01 十23 个45一倍','体彩','024',[2]]
]) {
 const wins=api.scanEntryForDraw({id:'position-money',original,amount:api.autoCalculateBet(original).amount},lottery,draw);
 assert.deepEqual(wins.map(win=>win.stake),stakes,JSON.stringify({original,draw,wins}));
 assert.deepEqual(wins.map(win=>win.prize),stakes.map(stake=>stake*950));
}
for(const source of ['体百01 十23 一米','体百01 十23 个45一米未知','体百01 十23 个45一米双飞12','体百01 十23 个45一米2倍','体百01 十23 个45一米两米','福百01 十23 个45一米体百67 十89 个01一米']) {
 assert.equal(api.parseThreePositionTrailingMoney(source),null,source);
}
console.log('POSITION_MONEY_ORDER payout and scope checks passed');

const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null},setItem(){}},{getElementById:el,querySelectorAll(){return []},createElement:el},()=>false,{});
const original='福611.616.711.716.636.631.763.731一元直组16元';
let checks=0;
for(const [lottery,target,factor] of [['福','福彩',1],['体','体彩',1],['福体','福彩',2]]) for(const join of ['.',' ','、','-']) for(const play of ['直组','单组','组直','组单']) for(const [rate,stake] of [['一元',1],['0.5米',0.5],['2元',2],['1倍',2]]) {
  const total=8*2*stake*factor;
  const text=`${lottery}${['611','616','711','716','636','631','763','731'].join(join)}${/^\d/.test(rate)?' ':''}${rate}${play}${total}元`;
  const result=api.autoCalculateBet(text);
  assert.deepEqual([result.amount,result.claimed,result.confident],[total,total,true],JSON.stringify({text,result}));
  const wins=api.scanEntryForDraw({id:'test',original:text,amount:total},target,'611');
  assert.deepEqual(wins.map(w=>w.stake),[stake,stake],JSON.stringify({text,wins}));
  assert.equal(wins.reduce((sum,w)=>sum+w.prize,0),1260*stake,JSON.stringify({text,wins}));
  checks++;
}
const wrong=api.autoCalculateBet(original.replace('16元','17元'));
assert.deepEqual([wrong.amount,wrong.claimed],[16,17],JSON.stringify(wrong));
const separate=api.autoCalculateBet('福611.616直1元组16元');
assert.equal(separate.amount,34,JSON.stringify(separate));
console.log(`MONEY_PREFIX_BOTH_TOTAL passed=${checks+2}`);

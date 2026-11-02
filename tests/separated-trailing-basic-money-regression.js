const fs=require('fs'),assert=require('assert/strict');
const el=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw,parseSharedDirectGroupRates};')({getItem(){return null;},setItem(){}},{getElementById:el,querySelectorAll(){return [];},createElement:el},()=>false,{});
const original=`853-524-536-553×588-

458-856-404-340-882-

391-456-268-345-628-

854-009-405-312-289

593-125-497-505-147-

889-685-650-250-340

福单组1元60元`;
console.log(JSON.stringify(api.autoCalculateBet(original)));
let checks=0;
function amount(text,expected,claimed){const r=api.autoCalculateBet(text);assert.equal(r.amount,expected,JSON.stringify({text,r}));assert.equal(r.confident,true);assert.equal(r.claimed,claimed);checks++;}
function prize(text,lottery,draw,expected){const wins=api.scanEntryForDraw({id:'separator',original:text,amount:999},lottery,draw);assert.equal(wins.reduce((s,w)=>s+w.prize,0),expected,JSON.stringify({text,lottery,draw,wins}));checks++;}
amount(original,60,60);
amount(original.replace('1元60元','1元99元'),60,99);
for(const [draw,payout] of [['340',2210],['009',1260],['553',1260],['588',1260]])prize(original,'福彩',draw,payout);
prize(original,'体彩','340',0);
for(const lottery of ['福','体','福体'])for(const play of ['单组','直组','组单','组直'])for(const rate of [.5,1,3])for(const sep of ['×','-\n\n','—','，']){
 const text=`001${sep}001${sep}112${sep}123-\n${lottery}${play}${rate}元99元`;
 amount(text,8*rate*(lottery==='福体'?2:1),99);
 for(const game of ['福彩','体彩']){
  const hit=lottery==='福体'||(game==='福彩'?lottery==='福':lottery==='体');
  prize(text,game,'001',hit?2520*rate:0);
 }
}
for(const text of ['福123×2单组1元','福12×123单组1元','福123×4567单组1元','福123单组1元×2','福1×23单组1元']){assert.equal(api.parseSharedDirectGroupRates(text),null,text);checks++;}
console.log(JSON.stringify({checks,failures:0}));

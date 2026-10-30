const fs=require('fs');
const assert=require('assert/strict');
const element=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const app=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')({getItem(){return null;},setItem(){}},{getElementById:element,querySelectorAll(){return [];},createElement:element},()=>false,{});
const failures=[];
let checks=0;
function check(category,text,expected,draws) {
 checks++;
 const result=app.autoCalculateBet(text);
 if(!result.confident||result.amount!==expected) failures.push({category,text,expected,result});
 if(draws) for(const [lottery,draw,prize] of draws){
  checks++;
  const wins=app.scanEntryForDraw({id:'matrix',original:text,amount:expected},lottery,draw);
  const actual=Math.round(wins.reduce((sum,win)=>sum+win.prize,0)*100)/100;
  if(actual!==prize)failures.push({category:`${category}-payout`,text,lottery,draw,expected:prize,actual,wins});
 }
}
const lists=[['013','310','112'],['605','506','605'],['277','272','772'],['008','080','800'],['145','249','389'],['731','137','371']];
for(const lottery of ['福','体','福体']) for(const numbers of lists) for(const [direct,group] of [[1,1],[0.5,2],[4,6]]) {
 const factor=lottery==='福体'?2:1;
 const codes=numbers.join(' ');
 const amount=numbers.length*(direct+group)*factor;
 const forms=[
  `${lottery}${codes}直选${direct}元组选${group}元`,
  `${lottery}直选${direct}元组选${group}元\n${codes}`,
  `${codes}\n直选${direct}元组选${group}元${lottery}`,
  `${lottery}${codes}直选${direct}米，组选${group}米`,
  `${lottery}${codes} ${direct}元直选${group}元组选`,
  `${lottery}${direct}元直选${group}元组选\n${codes}`,
  `${lottery}${codes} ${group}元组选${direct}元直选`,
  `${lottery}${group}元组选${direct}元直选\n${codes}`,
  `${lottery}${codes}组选${group/2}倍直选${direct/2}倍`,
  `${lottery}${codes}直选${direct}元组选${group}元合计${amount+1}`
 ];
 const draw=numbers[0];
 const sorted=[...draw].sort().join('');
 const prize=numbers.reduce((sum,number)=>sum+(number===draw?direct*950:0)+([...number].sort().join('')===sorted?group*(new Set(draw).size===2?310:155):0),0);
 for(const source of forms) check('direct-group',source,amount,[['福彩',draw,lottery==='体'?0:prize],['体彩',draw,lottery==='福'?0:prize]]);
}
for(const lottery of ['福','体']) for(const size of [4,5,6,7]) for(const stake of [0.5,10,30]) for(const play of ['组三','组六']) {
 const code='0123456789'.slice(0,size);
 for(const source of [`${lottery}${code}${play}${stake}米`,`${lottery}${play}${code}各${stake}米`,`${code}${play}记${stake}米${lottery}`])check('multi-group',source,stake);
}
for(const lottery of ['福','体']) for(const play of ['双飞','独胆','跨度','和值']) for(const value of play==='双飞'?['13','67']:play==='和值'?['6','17']:['3','6']) for(const stake of [10,30]) {
 for(const source of [`${lottery}${value}${play}${stake}元`,`${lottery}${play}${value}打${stake}元`])check('special-money',source,stake);
}
for(const lottery of ['福','体']) for(const rate of [0.2,0.5,1,2]) for(const prefix of [true,false]) {
 const source=`${lottery}${prefix?`${rate}米\n`:''}百012\n十3456\n个789${prefix?'':` ${rate}米`}`;
 check('position',source,36*rate,[[lottery==='福'?'福彩':'体彩','037',rate*950]]);
}
for(const lottery of ['福','体']) for(const rate of [0.5,1,2]) for(const play of ['直','组']) {
 const numbers=['013','310','112'];
 const codes=numbers.join('.');
 const target=lottery==='福'?'福彩':'体彩';
 for(const claimed of [numbers.length*rate,99]) {
  const source=`${lottery}${codes}.${rate}元${play}${claimed}元`;
  check('leading-price-subtotal',source,3*rate,[[target,'013',rate*(play==='直'?950:310)]]);
  assert.equal(app.autoCalculateBet(source).claimed,claimed);
 }
 for(const number of ['000','111','999'])check('listed-leopard',`${lottery}${number}豹子${rate}倍`,2*rate,[[target,number,1900*rate]]);
}
for(const text of ['213 217 218 福彩444注直各一倍','213 217 福彩444注直组各一倍']) {
 checks++;
 assert.equal(app.autoCalculateBet(text).confident,false,`Count mismatch must stay flagged: ${text}`);
}
for(const [source,expected] of [
 ['福4-7胆各20   1246789组六20组三5\n体3-9胆各20  0123679组六20组三5\n共130',130],
 ['福2体1各三百',600],['体4福7各五十',100],
 ['福彩胆4打20元；体彩独胆5打20元',40],
 ['福胆9打0.5米',0.5],['体2-8胆各3倍',60],
 ['福3拖125678组六40组三20\n体1拖234679组三10组六30\n共999',100]
])check('dan-and-scope',source,expected);
check('dan-shared-lottery-payout','福2体1各三百',600,[['福彩','234',1050],['福彩','134',0],['体彩','134',1050],['体彩','234',0]]);
check('dan-separated-payout','福彩胆4打20元；体彩独胆5打20元',40,[['福彩','145',70],['体彩','145',70],['福彩','123',0]]);
check('dan-mixed-payout','福4-7胆各20   1246789组六20组三5',65,[['福彩','147',230],['福彩','447',177.5],['体彩','147',0]]);
for(const first of ['福','体']) for(const stake of [0.5,10,30]) for(const separator of ['\n','；']) {
 const second=first==='福'?'体':'福';
 const target=first==='福'?'福彩':'体彩';
 const opposite=target==='福彩'?'体彩':'福彩';
 const source=`${first}胆4打${stake}元${separator}${second}独胆5打${stake*2}元`;
 check('dan-scope-generated',source,stake*3,[[target,'145',stake*3.5],[opposite,'145',stake*7],[target,'125',0]]);
 for(const form of [`${first}4-7胆各${stake}元   1246789组六20组三5`,`${first}独胆4-7各${stake}元\n1246789组三5组六20`]) {
  check('dan-group-generated',form,stake*2+25,[[target,'147',stake*7+90],[target,'447',stake*7+37.5],[opposite,'147',0]]);
 }
}
fs.mkdirSync('tests/reports',{recursive:true});
fs.writeFileSync('tests/reports/systematic-rule-matrix.json',JSON.stringify({checks,failures},null,2));
console.log(JSON.stringify({checks,failures:failures.length,categories:[...new Set(failures.map(f=>f.category))]}));
for(const failure of failures.slice(0,12))console.log(JSON.stringify(failure));
assert.equal(failures.length,0);

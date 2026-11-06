const fs = require('fs');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet,scanEntryForDraw};')(
  { getItem() { return null; }, setItem() {} },
  { getElementById: element, querySelectorAll() { return []; }, createElement: element }, () => false, {}
);
const sorted = value => [...value].sort().join('');
const roundMoney = value => Math.round(value * 100) / 100;
const sums = [8000,3100,1580,940,610,420,320,250,200,160,140,130,120,115,115,120,130,140,160,200,250,320,420,610,940,1580,3100,8000];
const spans = [800,175,98,75,65,63,65,75,98,175];
function bet(kind, variant) {
  const digits = Array.from({length: 5}, (_, index) => String((variant + index) % 10));
  const [a,b,c,d] = digits;
  const single = a+b+c;
  const repeated = a+a+b;
  const stake = [.5,2,10][variant % 3];
  const matches = draw => sorted(draw) === sorted(single);
  const groupPrize = draw => matches(draw) ? stake * 155 : 0;
  const base = { kind, draws: [single, c+b+a, repeated, a+a+a, b+c+d, '999'], amount: stake };
  switch (kind) {
    case 'counted': return {...base, text:`${single} ${single} ${repeated} 二直一组`, amount:18,
      prize:draw => [single,single,repeated].reduce((total,number) => total + (draw === number ? 3800 : 0) + (new Set(draw).size > 1 && sorted(draw) === sorted(number) ? (new Set(draw).size === 2 ? 620 : 310) : 0),0)};
    case 'cash-header': return {...base, text:`组${stake}元直${stake}元\n${single} ${repeated}`, amount:4*stake,
      prize:draw => [single,repeated].reduce((total,number) => total + (draw === number ? stake*950 : 0) + (new Set(draw).size > 1 && sorted(draw) === sorted(number) ? stake*(new Set(draw).size === 2 ? 310 : 155) : 0),0)};
    case 'group': return {...base,text:`${single}组选${stake}元`,prize:groupPrize};
    case 'dan': return {...base,text:`独胆${a}打${stake}元`,prize:draw=>draw.includes(a)?stake*3.5:0};
    case 'fly': return {...base,text:`${a}${b}双飞${stake}元`,prize:draw=>draw.includes(a)&&draw.includes(b)?stake*17:0};
    case 'position': return {...base,text:`一码定位百位${a}打${stake}元`,prize:draw=>draw[0]===a?stake*9.5:0};
    case 'group6-pool': return {...base,text:`${a+b+c+d}组六${stake}元`,prize:draw=>new Set(draw).size===3&&[...draw].every(digit=>(a+b+c+d).includes(digit))?stake*38:0};
    case 'group3-pool': return {...base,text:`${a+b+c+d}组三${stake}元`,prize:draw=>new Set(draw).size===2&&[...draw].every(digit=>(a+b+c+d).includes(digit))?stake*26:0};
    case 'rotor': return {...base,text:`${single}转圈各${stake}元`,amount:6*stake,prize:draw=>matches(draw)?stake*950:0};
    case 'dantuo': return {...base,text:`${a}拖${b+c+d+digits[4]}组六${stake}元`,prize:draw=>new Set(draw).size===3&&draw.includes(a)&&[...draw].every(digit=>digits.includes(digit))?stake*15.5:0};
    case 'sum': {
      const sum = [...single].reduce((total,digit)=>total+Number(digit),0);
      return {...base,text:`和值${sum}各${stake}元`,prize:draw=>[...draw].reduce((total,digit)=>total+Number(digit),0)===sum?stake*sums[sum]/10:0};
    }
    case 'span': {
      const span = Math.max(...single)-Math.min(...single);
      return {...base,text:`跨度${span}各${stake}元`,prize:draw=>Math.max(...draw)-Math.min(...draw)===span?stake*spans[span]/10:0};
    }
  }
}
const kinds = ['counted','cash-header','group','dan','fly','position','group6-pool','group3-pool','rotor','dantuo','sum','span'];
let checks=0,cases=0;
const failures=[];
function verify(text, parts) {
  cases++;
  const amount = roundMoney(parts.reduce((total,part)=>total+part.bet.amount*part.games.length,0));
  const result=api.autoCalculateBet(text+'\n共999');
  checks++;
  if(result.amount!==amount||!result.confident||result.claimed!==999)failures.push({type:'amount',text,expected:amount,result});
  const draws=[...new Set(parts.flatMap(part=>part.bet.draws))];
  for(const lottery of ['福彩','体彩'])for(const draw of draws){
    const expected=roundMoney(parts.reduce((total,part)=>total+(part.games.includes(lottery)?roundMoney(part.bet.prize(draw)):0),0));
    const wins=api.scanEntryForDraw({id:'mixed-matrix',record:71,original:text+'\n共999',amount:999},lottery,draw);
    const actual=roundMoney(wins.reduce((total,win)=>total+win.prize,0));
    checks++;
    if(actual!==expected)failures.push({type:'prize',text,lottery,draw,expected,actual});
  }
}
for(let first=0;first<kinds.length;first++)for(let second=0;second<kinds.length;second++){
  const left=bet(kinds[first],first%5),right=bet(kinds[second],(second+3)%7);
  for(const separator of ['\n','；',' ']){
    verify(`福${left.text}${separator}体${right.text}`,[{bet:left,games:['福彩']},{bet:right,games:['体彩']}]);
  }
  if(first%3===0){
    const tail=bet('group',8);
    verify(`体${left.text}\n福${right.text}\n${tail.text}`,[{bet:left,games:['体彩']},{bet:right,games:['福彩']},{bet:tail,games:['福彩']}]);
    verify(`福体${left.text}\n体${right.text}`,[{bet:left,games:['福彩','体彩']},{bet:right,games:['体彩']}]);
  }
}
fs.mkdirSync('tests/reports',{recursive:true});
fs.writeFileSync('tests/reports/mixed-play-scope-matrix.json',JSON.stringify({cases,checks,failures},null,2));
console.log(JSON.stringify({cases,checks,failures:failures.length,examples:failures.slice(0,10)},null,2));
if(failures.length)process.exitCode=1;

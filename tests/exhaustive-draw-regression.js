const fs = require('fs');
const element = () => ({ value:'', checked:false, options:[], style:{}, classList:{toggle(){},add(){},remove(){}}, replaceChildren(){}, append(){}, setAttribute(){} });
const api = Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')(
  {getItem(){return null;},setItem(){}}, {getElementById:element,querySelectorAll(){return [];},createElement:element}, () => false, {}
);
const sorted = value => [...value].sort().join('');
const permutations = (number,draw) => sorted(number) === sorted(draw);
const pool = (draw,digits,size) => new Set(draw).size === size && [...draw].every(digit => digits.includes(digit));
const bets = [
  {name:'直选及前导零',text:'福012直0.5元',amount:.5,games:['福彩'],prize:draw=>draw==='012'?475:0},
  {name:'直选两倍',text:'体123直2倍',amount:4,games:['体彩'],prize:draw=>draw==='123'?3800:0},
  {name:'组六单式',text:'福123组选1倍',amount:2,games:['福彩'],prize:draw=>permutations('123',draw)?310:0},
  {name:'组三单式',text:'体122组选1倍',amount:2,games:['体彩'],prize:draw=>permutations('122',draw)?620:0},
  {name:'重复直选组选及行尾合计',text:'福112 112 121一直一组12元',amount:12,games:['福彩'],prize:draw=>['112','112','121'].reduce((sum,n)=>sum+(draw===n?1900:0)+(permutations(n,draw)?620:0),0)},
  {name:'福彩转圈直选',text:'福123转圈1倍',amount:12,games:['福彩'],prize:draw=>permutations('123',draw)?1900:0},
  {name:'体彩转圈直选',text:'体123转圈1倍',amount:12,games:['体彩'],prize:draw=>permutations('123',draw)?1900:0},
  {name:'四码全倒直选',text:'体0958组六直一倍',amount:48,games:['体彩'],prize:draw=>pool(draw,'0958',3)?1900:0},
  {name:'五码福体全倒直选',text:'福体01234组六直一倍',amount:240,games:['福彩','体彩'],prize:draw=>pool(draw,'01234',3)?1900:0},
  {name:'六码全倒直选',text:'福012345组六直一倍',amount:240,games:['福彩'],prize:draw=>pool(draw,'012345',3)?1900:0},
  {name:'含重复码全倒直选',text:'福1123组六直一倍',amount:24,games:['福彩'],prize:draw=>['112','121','211','113','131','311','123','132','213','231','312','321'].includes(draw)?1900:0},
  {name:'四码组六',text:'福1234组六1倍',amount:10,games:['福彩'],prize:draw=>pool(draw,'1234',3)?380:0},
  {name:'四码组三',text:'体1234组三1倍',amount:10,games:['体彩'],prize:draw=>pool(draw,'1234',2)?260:0},
  {name:'三码组三',text:'福123组三1倍',amount:10,games:['福彩'],prize:draw=>pool(draw,'123',2)?530:0},
  {name:'组六胆拖',text:'体胆1拖234组六1倍',amount:10,games:['体彩'],prize:draw=>draw.includes('1')&&pool(draw,'1234',3)?258:0},
  {name:'组三胆拖',text:'福胆1拖234组三1倍',amount:10,games:['福彩'],prize:draw=>draw.includes('1')&&pool(draw,'1234',2)?385:0},
  {name:'独胆',text:'福独胆1一倍',amount:10,games:['福彩'],prize:draw=>draw.includes('1')?35:0},
  {name:'双飞',text:'体12双飞一倍',amount:10,games:['体彩'],prize:draw=>draw.includes('1')&&draw.includes('2')?170:0},
  {name:'飞简称',text:'福27飞二十米',amount:20,games:['福彩'],prize:draw=>draw.includes('2')&&draw.includes('7')?340:0},
  {name:'百位一码定位',text:'福百位1一倍',amount:10,games:['福彩'],prize:draw=>draw[0]==='1'?95:0},
  {name:'二码定位',text:'体两码定位百位1十位2一倍',amount:10,games:['体彩'],prize:draw=>draw[0]==='1'&&draw[1]==='2'?950:0},
  {name:'二码定位中间通配',text:'福1X3两码定位各5元',amount:5,games:['福彩'],prize:draw=>draw[0]==='1'&&draw[2]==='3'?475:0},
  {name:'多个二码定位',text:'体92* 9*5 97*各5元两定',amount:15,games:['体彩'],prize:draw=>((draw[0]==='9'&&draw[1]==='2'?1:0)+(draw[0]==='9'&&draw[2]==='5'?1:0)+(draw[0]==='9'&&draw[1]==='7'?1:0))*475},
  {name:'一码定位通配',text:'体XX3一码定位各10元',amount:10,games:['体彩'],prize:draw=>draw[2]==='3'?95:0},
  {name:'两个一码定位',text:'体百位1十位2一倍',amount:20,games:['体彩'],prize:draw=>(draw[0]==='1'?95:0)+(draw[1]==='2'?95:0)},
  {name:'明确一码定位',text:'体十位4个位7一码定位各一倍',amount:20,games:['体彩'],prize:draw=>(draw[1]==='4'?95:0)+(draw[2]==='7'?95:0)},
  {name:'和值',text:'福和值6一倍',amount:10,games:['福彩'],prize:draw=>[...draw].reduce((s,d)=>s+Number(d),0)===6?320:0},
  {name:'跨度',text:'体跨度4一倍',amount:10,games:['体彩'],prize:draw=>Math.max(...draw)-Math.min(...draw)===4?65:0},
  {name:'豹子全包',text:'福豹子全包一倍',amount:10,games:['福彩'],prize:draw=>new Set(draw).size===1?800:0},
  {name:'福体直选',text:'福体123直1倍',amount:4,games:['福彩','体彩'],prize:draw=>draw==='123'?1900:0},
  {name:'福体四码组六',text:'福体1234组六1倍',amount:20,games:['福彩','体彩'],prize:draw=>pool(draw,'1234',3)?380:0},
  {name:'两项复式各自金额',text:'福2358组六二十组三十元',amount:30,games:['福彩'],prize:draw=>(pool(draw,'2358',3)?760:0)+(pool(draw,'2358',2)?260:0)},
  {name:'福体复式固定金额',text:'福体1234组六20元',amount:40,games:['福彩','体彩'],prize:draw=>pool(draw,'1234',3)?760:0},
  {name:'福体组六胆拖',text:'福体胆1拖234组六1倍',amount:20,games:['福彩','体彩'],prize:draw=>draw.includes('1')&&pool(draw,'1234',3)?258:0}
];
const failures=[];
let checks=0;
for(const bet of bets){
  const calculated=api.autoCalculateBet(bet.text);checks++;
  if(!calculated.confident||calculated.amount!==bet.amount)failures.push({type:'amount',bet:bet.name,text:bet.text,expected:bet.amount,result:calculated});
  for(const lottery of bet.games)for(let number=0;number<1000;number++){
    const draw=String(number).padStart(3,'0');
    const wins=api.scanEntryForDraw({id:'exhaustive',record:42,original:bet.text,amount:bet.amount},lottery,draw);
    const actual=Number(wins.reduce((sum,win)=>sum+win.prize,0).toFixed(2));
    const expected=bet.prize(draw);
    checks++;
    if(actual!==expected)failures.push({type:'prize',bet:bet.name,text:bet.text,lottery,draw,expected,actual,wins});
  }
  if(bet.games.length===1){
    const lottery=bet.games[0]==='福彩'?'体彩':'福彩';
    for(const draw of ['012','123','122','111','999']){
      const wins=api.scanEntryForDraw({id:'other-game',original:bet.text,amount:bet.amount},lottery,draw);
      checks++;
      if(wins.length)failures.push({type:'scope',bet:bet.name,text:bet.text,lottery,draw,wins});
    }
  }
}
fs.mkdirSync('tests/reports',{recursive:true});
fs.writeFileSync('tests/reports/exhaustive-draw-regression.json',JSON.stringify({checks,failures},null,2));
console.log(JSON.stringify({bets:bets.length,checks,failures:failures.length,examples:failures.slice(0,12)},null,2));
if(failures.length)process.exitCode=1;

const fs=require('fs');
const assert=require('assert/strict');
const element=()=>({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const api=Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw};')(
  {getItem(){return null;},setItem(){}},{getElementById:element,querySelectorAll(){return [];},createElement:element},()=>false,{}
);
const cases=[
  {name:'前段小计不当作整条合计',text:'福\n408\n5直5组合计20\n048组三50',amount:70,claimed:'',wins:[]},
  {name:'行尾号码接下一段',text:'福112.121 一直一组，123 234\n123 345直组各1米，16',amount:16,claimed:16,wins:[['福彩','123',2210],['福彩','112',3140]]},
  {name:'跨行号码与不同玩法',text:'福001\n002各打二直一组\n123组选5组\n合计22',amount:22,claimed:22,wins:[['福彩','001',4420],['福彩','123',1550],['体彩','001',0]]},
  {name:'单式与不同复式金额',text:'福\n120\n130\n230三直两组\n0123组六二十组三十元\n合计60',amount:60,claimed:60,wins:[['福彩','120',7080],['福彩','110',260],['体彩','120',0]]},
  {name:'不同单价及后缀定位',text:'体123 124 130 140\n123 124直一元组一元\n12\\* 1*3 13*各5元两定',amount:27,wins:[['体彩','123',3160],['体彩','124',2685],['福彩','123',0]]},
  {name:'豹子与前段倍数分开',text:'福110、101、220、202、2单2组\n999一倍合计34',amount:34,claimed:34,wins:[['福彩','999',1900],['福彩','110',6280],['体彩','999',0]]},
  {name:'同一行不同玩法与合计',text:'福124.134.144一直一组，24飞二十米，242.424直各五倍，224.244组一倍，56',amount:56,claimed:56,wins:[['福彩','124',2550],['福彩','242',10460],['体彩','124',0]]},
  {name:'前置单价及转义空格',text:'福\n直1米\n&#x20;012 013\n012 013\n&#x20;102 103\n&#x20;111 222合计8',amount:8,claimed:8,wins:[['福彩','012',1900],['福彩','111',950],['体彩','012',0]]},
  {name:'多段和值与标点合计',text:'体，19和值打了10米，17和值5米🈴15米\n体，123组选2米🈴2米\n合计，17米',amount:17,claimed:17,wins:[['体彩','665',70],['体彩','199',200],['体彩','123',310]]}
];
for(const test of cases){
  const result=api.autoCalculateBet(test.text);
  assert.equal(result.confident,true,JSON.stringify({test,result}));
  assert.equal(result.amount,test.amount,JSON.stringify({test,result}));
  if(test.claimed!==undefined)assert.equal(result.claimed,test.claimed,JSON.stringify({test,result}));
  for(const [lottery,draw,expected] of test.wins){
    const wins=api.scanEntryForDraw({id:'system-audit',original:test.text,amount:test.amount},lottery,draw);
    assert.equal(wins.reduce((sum,win)=>sum+win.prize,0),expected,JSON.stringify({test,lottery,draw,wins,expected}));
  }
}
console.log(JSON.stringify({cases:cases.length,checks:cases.reduce((sum,test)=>sum+2+test.wins.length,0),failures:0}));

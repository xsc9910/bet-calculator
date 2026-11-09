const fs = require('fs');
const elements = new Map();
const element = () => ({value:'',checked:false,options:[],style:{},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},append(){},setAttribute(){}});
const get = id => { if (!elements.has(id)) elements.set(id, element()); return elements.get(id); };
let copied = '';
const app = Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8') + ';return {set: (items,filter) => {entries=items;currentFilter=filter;render();}};')(
  {getItem(){return null;},setItem(){}}, {getElementById:get,querySelectorAll(){return [];},createElement:element},()=>false,{clipboard:{async writeText(value){copied=value;}}});
const items = [{record:1,lottery:'福彩',match:'850',prize:100.1},{record:2,lottery:'体彩',match:'069',prize:200},{record:3,lottery:'福彩',match:'850',prize:100.1}];
async function test() {
  for (const [filter, search, expected] of [['all','','100.1+200+100.1=400.2'],['福彩','','100.1+100.1=200.2'],['all','069','200=200'],['all','missing','0=0']]) {
    get('searchInput').value = search;
    app.set(items,filter);
    if (get('formulaText').textContent !== expected) throw new Error(`Wrong formula ${filter}/${search}: ${get('formulaText').textContent}`);
    await get('copyFormula').onclick();
    if (copied !== expected || /\s/.test(copied)) throw new Error('Copy must match visible list without spaces');
  }
  console.log('WINNING_FORMULA passed=4 failed=0: filters, search, duplicates, decimals, empty, clipboard');
}
test().catch(error => {console.error(error);process.exitCode=1;});

const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage','document','confirm','navigator',fs.readFileSync('app.js','utf8')+';return {autoCalculateBet,scanEntryForDraw,parseCompoundSelectionBasis};')({getItem(){return null;},setItem(){}},{getElementById:element,querySelectorAll(){return [];},createElement:element},()=>false,{});
const cases = [];
for (const lottery of ['福', '体', '福体']) {
  const factor = lottery === '福体' ? 2 : 1;
  for (const numbers of ['306', '112', '306 063', '306 306', '306 112']) {
    const count = numbers.split(' ').length;
    for (const play of ['组三一米', '组三打1米', '打组三1米', '组三记1米', '组三各1元', '组三买一米', '三码组三1米', '要打组三1米', '一米组三', '组三各记1元']) {
      cases.push([`${lottery}${numbers}${play}`, count * factor]);
      cases.push([`${lottery}${play}\n${numbers}`, count * factor]);
    }
  }
}
cases.push(
  ['306 063组三一米', 2],
  ['福306、063组三记0.5米', 1],
  ['体306/063组三买五毛', 1],
  ['福306 112组三记1倍', 12],
  ['体306 112组三买2倍', 24],
  ['福306组三记1米\n体063组三记2米\n合计3', 3],
  ['福306 063组三记1米合计99', 2],
  ['福306组三记1米\n112组三买2米\n合计3', 3],
  ['体306 063一米单组组三记一米', 6],
  ['福306 063组选2米组三买一米', 6],
  ['体306 063直组各1米组三各记1米', 6]
);
let failures=0;
for (const [text, amount] of cases) {
  const result=api.autoCalculateBet(text);
  if (result.amount !== amount || !result.confident) {
    failures++;
    if (failures <= 15) console.log(JSON.stringify({text,expected:amount,result}));
  }
}
console.log({cases:cases.length,failures});
assert.equal(failures,0);
assert.equal(api.autoCalculateBet('福306 063组三记1米合计99').claimed,99);
for (const [original, lottery, draw, prizes] of [
  ['体306 063组三记1米', '体彩', '330', [53,53]],
  ['体306 063一米单组组三记一米', '体彩', '330', [53,53]],
  ['体306 063一米单组组三记一米', '体彩', '306', [950,155,155]],
  ['体组三买一米\n306 063', '体彩', '606', [53,53]],
  ['福306 112组三记1米', '福彩', '121', [310]],
  ['福三码组三一米306', '福彩', '330', [53]],
  ['福306 306组三各记一米', '福彩', '330', [53,53]],
  ['福306 112组三记1倍', '福彩', '330', [530]],
  ['福306 112组三记1倍', '福彩', '121', [620]],
  ['体306组三记1米', '体彩', '306', []],
  ['体306组三买1米', '体彩', '333', []],
  ['体306组三记1米', '福彩', '330', []],
  ['福112组三记1米', '福彩', '122', []]
]) {
  const wins = api.scanEntryForDraw({id:'group3-money', original, amount:api.autoCalculateBet(original).amount},lottery,draw);
  assert.deepEqual(wins.map(win=>win.prize),prizes,JSON.stringify({original,draw,wins}));
}
for (const text of ['福306组三记', '福306组三记1米未知玩法', '福306组三记1米体063组三记2米', '福306组三记1米双飞36', '福306组三记1米直2米']) {
  assert.equal(api.parseCompoundSelectionBasis(text),null,text);
}
console.log('THREE_DIGIT_GROUP3_MONEY payout and incomplete-input checks passed');

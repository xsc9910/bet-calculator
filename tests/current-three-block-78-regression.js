const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet, scanEntryForDraw};')({ getItem() { return null; }, setItem() {} }, { getElementById: element, querySelectorAll() { return []; }, createElement: element }, () => false, {});
const original = '褔012357组六20米组三10米 共30米\n0123567 01269 组六各10米共20米\n\n福517  217  257  357  863   688  668各一单一组28米共计78米';
const cases = [
  [original, 78],
  ['褔012357组六20米组三10米 共30米', 30],
  ['福0123567 01269 组六各10米共20米', 20],
  ['福517 217 257 357 863 688 668各一单一组28米', 28]
];
for (const play of ['一单一组', '一直一组', '两单一组', '一组一直']) {
  const amount = play === '两单一组' ? 12 : 8;
  for (const total of ['合计', '共计', '总计']) {
    cases.push([`福517 217各${play}${amount}米${total}50米`, amount]);
  }
}
cases.push(['福517 217直组各1米合计4米', 4]);
cases.push(['福517 217一直一组各1米合计4米', 4]);
let failures = 0;
for (const [text, amount] of cases) {
  const result = api.autoCalculateBet(text);
  if (result.amount !== amount || !result.confident) { failures++; console.log(JSON.stringify({ text, result })); }
}
assert.equal(failures, 0);
assert.equal(api.autoCalculateBet(original).claimed, 78);
const wins = api.scanEntryForDraw({ id: 'subtotal', original: '福517 217各一单一组8米共计50米', amount: 8 }, '福彩', '517');
assert.deepEqual(wins.map(win => win.stake), [2, 2], JSON.stringify(wins));
console.log(`THREE_BLOCK_78 passed=${cases.length}`);

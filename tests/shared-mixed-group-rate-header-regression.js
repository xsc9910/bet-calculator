const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet, scanEntryForDraw, parseSharedMixedGroupRates};')({ getItem() { return null; }, setItem() {} }, { getElementById: element, querySelectorAll() { return []; }, createElement: element }, () => false, {});
const cases = [
  ['体彩排列三3589\n13589\n组六1倍组三5块', 30],
  ['体彩3589组六1倍组三5块', 15],
  ['体彩13589组六1倍组三5块', 15]
];
for (const lottery of ['体彩排列三', '体彩', '福彩3D', '福体']) {
  for (const tail of ['组六1倍组三5块', '组三5米，组六一倍', '组六各10元 组三各5元']) {
    const amount = lottery === '福体' ? 60 : 30;
    cases.push([`${lottery}3589\n13589\n${tail}`, amount]);
    cases.push([`${lottery}\n3589 13589\n${tail}`, amount]);
  }
}
cases.push(['福3589\n体13589\n组六2倍组三五毛', 41]);
cases.push(['体3589\n3589\n组六1倍组三5米\n合计30', 30]);
cases.push(['体3589\n13589\n组六1倍组三5块\n合计99', 30]);
for (const [text, amount] of cases) {
  const result = api.autoCalculateBet(text);
  assert.deepEqual([result.amount, result.confident], [amount, true], JSON.stringify({ text, result }));
}
assert.equal(api.autoCalculateBet(cases.at(-1)[0]).claimed, 99);
for (const [draw, expected] of [['358', [[10, 380], [10, 155]]], ['335', [[5, 130], [5, 77.5]]], ['333', []], ['246', []]]) {
  const wins = api.scanEntryForDraw({ id: 'shared-rates', original: cases[0][0], amount: 30 }, '体彩', draw);
  assert.deepEqual(wins.map(win => [win.stake, win.prize]), expected, JSON.stringify({ draw, wins }));
}
const mixed = '福3589\n体13589\n组六1倍组三5块';
assert.equal(api.scanEntryForDraw({ id: 'mixed', original: mixed, amount: 30 }, '福彩', '358').length, 1);
assert.equal(api.scanEntryForDraw({ id: 'mixed', original: mixed, amount: 30 }, '体彩', '358').length, 1);
for (const text of ['体3589\n13589遗漏\n组六1倍组三5块', '体3589\n13589\n组六1倍组三', '体3589\n13589\n组六1倍组三5块双飞']) assert.equal(api.parseSharedMixedGroupRates(text), null);
console.log(`SHARED_MIXED_GROUP_RATE_HEADER passed=${cases.length}`);

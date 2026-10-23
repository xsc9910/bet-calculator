const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet, scanEntryForDraw};')({getItem(){return null;},setItem(){}}, {getElementById:element,querySelectorAll(){return [];},createElement:element}, () => false, {});
const original = '570—691—527—014\n一米组单福合计8';
const cases = [[original, 8, 8]];
for (const separator of ['—', '–', '－', '-', '，', '.', ' ']) {
  for (const play of ['组单', '单组', '组直', '直组']) {
    const numbers = ['026', '138', '249'].join(separator);
    cases.push([`${numbers}\n五毛${play}体合计3`, 3, 3]);
    cases.push([`福0.3元${play}\n${numbers}`, 1.8, '']);
    cases.push([`${numbers}福${play}1米`, 6, '']);
  }
}
cases.push(['570—570—014\n一米组单福合计6', 6, 6]);
cases.push(['570—691\n一米组单福合计9', 4, 9]);
for (const [source, amount, claimed] of cases) {
  const result = api.autoCalculateBet(source);
  assert.deepEqual([result.amount, result.claimed, result.confident], [amount, claimed, true], JSON.stringify({ source, result }));
}
const wins = api.scanEntryForDraw({ id: 'reordered-direct-group', original, amount: 8, record: 1 }, '福彩', '570');
assert.equal(wins.length, 2, JSON.stringify(wins));
assert.deepEqual(wins.map(win => win.stake), [1, 1]);
assert.deepEqual(wins.map(win => win.prize), [950, 155]);
console.log(`REORDERED_DIRECT_GROUP_MONEY passed=${cases.length} plus payout checks`);

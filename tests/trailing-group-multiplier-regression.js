const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet, lotteryTargets};')({getItem(){return null;},setItem(){}}, {getElementById:element,querySelectorAll(){return [];},createElement:element}, () => false, {});

const original = `体彩排列三0245
02457
024579
组六2倍`;
const cases = [
  [original, 136],
  [`福0123
01234
组六一倍`, 28],
  [`体0123
01234
组六两倍
合计56`, 56],
  [`福0123
01234
组三一倍`, 64]
];

for (const [text, expected] of cases) {
  const result = api.autoCalculateBet(text);
  assert.equal(result.confident, true, JSON.stringify({ text, result }));
  assert.equal(result.amount, expected, JSON.stringify({ text, result }));
}
assert.deepEqual(api.lotteryTargets(original), ['体彩']);
console.log(`TRAILING_GROUP_MULTIPLIER_SUMMARY passed=${cases.length} failed=0`);

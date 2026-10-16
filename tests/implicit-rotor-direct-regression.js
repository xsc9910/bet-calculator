const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet};')({getItem(){return null;},setItem(){}}, {getElementById:element,querySelectorAll(){return [];},createElement:element}, () => false, {});
const cases = [
  ['体 0958 组六直一倍 48\n125 组六直一倍 12\n共60', 60, 60],
  ['体 2583 组六直一倍 48\n852 组六直一倍 12\n共60', 60, 60],
  ['3548体组六直选一倍\n共48', 48, 48],
  ['福体123组六直两倍\n共48', 48, 48]
];
for (const [text, expected, claimed] of cases) {
  const result = api.autoCalculateBet(text);
  assert.equal(result.confident, true, JSON.stringify({ text, result }));
  assert.equal(result.amount, expected, JSON.stringify({ text, result }));
  assert.equal(result.claimed, claimed, JSON.stringify({ text, result }));
}
const mismatch = api.autoCalculateBet('体0958组六直一倍47');
assert.equal(mismatch.confident, false, JSON.stringify(mismatch));
console.log(`IMPLICIT_ROTOR_DIRECT_SUMMARY passed=${cases.length + 1} failed=0`);

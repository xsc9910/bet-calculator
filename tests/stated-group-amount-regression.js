const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet};')({getItem(){return null;},setItem(){}}, {getElementById:element,querySelectorAll(){return [];},createElement:element}, () => false, {});
const cases = [
  ['147组三福彩记50米', 50],
  ['体彩147组六记50元', 50],
  ['福147组三买30元', 30],
  ['福147组三记50米\n体彩258组六记30米\n合计80', 80]
];
for (const [text, expected] of cases) {
  const result = api.autoCalculateBet(text);
  assert.equal(result.confident, true, JSON.stringify({ text, result }));
  assert.equal(result.amount, expected, JSON.stringify({ text, result }));
}
assert.equal(api.autoCalculateBet(cases[3][0]).claimed, 80);
console.log(`STATED_GROUP_AMOUNT_SUMMARY passed=${cases.length} failed=0`);

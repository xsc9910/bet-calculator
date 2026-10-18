const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet};')({getItem(){return null;},setItem(){}}, {getElementById:element,querySelectorAll(){return [];},createElement:element}, () => false, {});
const cases = [
  ['147组三福彩记50米', 50],
  ['体彩147组六记50元', 50],
  ['福147组三买30元', 30],
  ['福147组三记50米\n体彩258组六记30米\n合计80', 80],
  ['福彩豹子记10米', 10],
  ['体彩豹子打20元', 20],
  ['豹子买5米福', 5],
  ['福豹子记十元', 10],
  ['福体豹子记10米', 20],
  ['福豹子各记10米', 100],
  ['福豹子一倍', 10],
  ['福豹子各1米', 10],
  ['福豹子记10米\n体豹子记20米\n合计30', 30]
];
for (const [text, expected] of cases) {
  const result = api.autoCalculateBet(text);
  assert.equal(result.confident, true, JSON.stringify({ text, result }));
  assert.equal(result.amount, expected, JSON.stringify({ text, result }));
}
assert.equal(api.autoCalculateBet(cases[3][0]).claimed, 80);
console.log(`STATED_GROUP_AMOUNT_SUMMARY passed=${cases.length} failed=0`);

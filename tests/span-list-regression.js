const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet};')({getItem(){return null;},setItem(){}}, {getElementById:element,querySelectorAll(){return [];},createElement:element}, () => false, {});
const cases = [
  ['福家跨1.6.2.9各10元', 40],
  ['福跨1.6.2.9各10元', 40],
  ['体跨度3、5、8各20元', 60],
  ['福跨度1 6 2 9各2倍', 80],
  ['福跨度1、6各0.5元', 1],
  ['福跨1+跨8各10元', 20],
  ['福跨1各10元', 10],
  ['福跨度1.6各10元\n体跨度2.9各20元', 60],
  ['福体跨1.6各10元', 40],
  ['福跨1.6.2.9各10元合计50', 40],
];
for (const [text, amount] of cases) {
  const result = api.autoCalculateBet(text);
  console.log(JSON.stringify({text, result}));
  assert.equal(result.confident, true);
  assert.equal(result.amount, amount);
}
console.log(`SPAN_LIST_SUMMARY passed=${cases.length} failed=0`);

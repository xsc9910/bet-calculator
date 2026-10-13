const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const app = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + '; return { autoCalculateBet };')({ getItem(){return null;}, setItem(){} }, { getElementById:element, querySelectorAll(){return[];}, createElement:element }, () => false, {});
const original = `福 34568组六  五十元

福3458   3468组六三倍

体  245  248  258  458 045  048  058  458五组

体045  408 058  458十组

体458转子十倍

体4589组三三倍

体458组三 三倍

体0458组三 三倍

117  177  147三组体
合计498`;
const result = app.autoCalculateBet(original);
assert.deepEqual([result.amount, result.claimed, result.confident], [498, 498, true], JSON.stringify(result));
for (const [text, amount] of [
  ['体458组三三倍', 30],
  ['体458组三 3倍', 30],
  ['体458 548组三各三倍', 12],
  ['体336组三三倍', 6],
  ['福458组三三倍', 30],
  ['福体458组三三倍', 60],
  ['体458组三三元', 3]
]) assert.equal(app.autoCalculateBet(text).amount, amount, text);
console.log('PASS mixed Chinese stakes, duplicate group selections, three-digit group multipliers');

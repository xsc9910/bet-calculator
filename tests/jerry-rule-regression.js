const fs = require('node:fs');
const assert = require('node:assert/strict');

const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + '; return { autoCalculateBet };')(
  { getItem() { return null; }, setItem() {} },
  { getElementById: element, querySelectorAll() { return []; }, createElement: element },
  () => false,
  {}
);

const cases = [
  ['福豹子20元', 20],
  ['福豹子1米合计10', 10],
  ['体豹子各20元', 200],
  ['福豹子222、444、999各1米', 3],
  ['体豹子全包1米', 10],
  ['福\n组六一倍\n13579\n组三一倍\n3478', 20],
  ['体\n组三一倍\n3478\n组六两倍\n13579', 30],
  ['福\n组六20元\n12345\n组三10元\n3456\n共30元', 30],
  ['福组6 134579 20元\n福组6 024579 10元', 30],
  ['体组6 134567 20元', 20],
  ['福组3 135689 10元', 10],
  ['福组6 123456789五倍', 50],
  ['134679祖六组三各20米', 40],
  ['014579\n\n组六组三 个5米体', 10],
];

for (const [input, amount] of cases) {
  const result = api.autoCalculateBet(input);
  assert.equal(result.confident, true, `${input}: ${JSON.stringify(result)}`);
  assert.equal(result.amount, amount, input);
}

assert.equal(api.autoCalculateBet('福\n组六一倍\n13579\n组三一倍\n3478\n共22元').claimed, 22);
console.log(`PASS ${cases.length + 1} scoped group and leopard cases`);

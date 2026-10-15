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
  ['334.677.667.640.217.938.935.001.334.137.399.117.379.230.180.647.363.073.374.263.853.753，福一单四组', 220],
  ['福123 456一直一组\n体789一直一组', 12],
  ['福123直一倍 体456组选一倍', 4],
  ['福体123 456一直一组', 16],
  ['123 456福一单一组 789体一单一组', 12],
  ['福123 456\n体789\n一直一组', 12],
  ['福直组一倍！622\n体直组一倍！983\n合计8', 8],
  ['福314，319，364，369，814，819，864，869，308三直一组合计72元\n体102，107，152，157，602，607，652，657，308三直一组合计72元\n合计144', 144],
  ['福通用幸运36注✅️一直一组\n108 513 910 659 321 024 251 126 721 247 482 249 479 718 917 189 489 377 657 568 115 559 652 773 257 821 129 899 025 298 456 547 026 207 306 028合计144', 144],
  ['福01349 百十个 0.2米\n01389 百十个 0.2米\n012389 组六10米 组三五米\n0123789 组六20\n合计85', 85],
];

for (const [input, amount] of cases) {
  const result = api.autoCalculateBet(input);
  assert.equal(result.confident, true, `${input}: ${JSON.stringify(result)}`);
  assert.equal(result.amount, amount, input);
}

assert.equal(api.autoCalculateBet('福\n组六一倍\n13579\n组三一倍\n3478\n共22元').claimed, 22);
assert.equal(api.autoCalculateBet('福幸运3注一直一组\n123 456合计12').confident, false);
console.log(`PASS ${cases.length + 1} scoped group and leopard cases`);

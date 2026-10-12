const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet};')({getItem(){return null;},setItem(){}}, {getElementById:element,querySelectorAll(){return [];},createElement:element}, () => false, {});
const original = `896一组一直4元
641一组一直4元
795一直一组4元
599 995 959直6元
501直4元组4元
762一直一组4元
349组8元
1345679组六100
福

109一直一组4元
256 一直一组4元
409一组一直4元
069一直一组4元
264一直一组4元
175一直一组4元
667 766 676直6元
01259组六20元
109直10元108直8元
排
共206元`;
const cases = [
  [original, 206],
  [original.replace('共206元', '共200元'), 206],
  ['福599 995 959直6元', 6],
  ['体667 766 676直12元', 12],
  ['福599 995 959直各6元', 18],
  ['福599 995 959直2倍', 12],
  ['福123 456 789直6元', 18],
  ['福896一组一直4元', 4],
  ['体109直10元108直8元', 18],
  ['123一直一组4元\n排\n456一直一组4元\n福\n共8元', 8],
  ['12345组六30\n福\n56789组六20\n排\n共50元', 50],
];
for (const [text, amount] of cases) {
  const result = api.autoCalculateBet(text);
  assert.equal(result.confident, true, `${text}: ${JSON.stringify(result)}`);
  assert.equal(result.amount, amount, text);
}
assert.equal(api.autoCalculateBet(original).claimed, 206);
assert.equal(api.autoCalculateBet(original.replace('共206元', '共200元')).claimed, 200);
assert.equal(api.autoCalculateBet('123一直一组4元\n福\n456直2元').confident, false);
console.log(`PASS ${cases.length + 3} trailing lottery and group-three direct total cases`);
console.log(JSON.stringify(api.autoCalculateBet(original)));

const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet};')({getItem(){return null;},setItem(){}}, {getElementById:element,querySelectorAll(){return [];},createElement:element}, () => false, {});
const cases = [
  ['福\n3拖125678\n1拖234679组六各40组三20\n合计120', 120],
  ['福3拖125678 1拖234679组六各40组三20', 120],
  ['体\n2拖134578\n6拖123479组三各15组六35', 100],
  ['福\n3拖125678\n1拖234679\n组六各40组三20', 120],
  ['福\n3拖125678\n1拖234679组六各40组三20\n合计999', 120],
  ['福3拖125678组六40组三20\n体1拖234679组六10组三30', 100],
  ['福3拖125678组六各2倍组三1倍', 30],
  ['福3拖125678组六各0.5元组三2元', 2.5],
  ['福\n3拖125678\n1拖234679\n2拖134567组六各40组三20', 180],
  ['福\n5托134678\n3托134568\n7托123456\n组六各10\n55对10元\n756一直一组\n371一直一组\n37飞10元\n共计58元', 58]
];
for (const [text, expected] of cases) {
  const result = api.autoCalculateBet(text);
  console.log(JSON.stringify({text, result}));
  assert.equal(result.confident, true);
  assert.equal(result.amount, expected);
}
console.log(`DANTUO_SHARED_SUMMARY passed=${cases.length} failed=0`);

const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet,extractClaimedAmount};')({getItem(){return null;},setItem(){}}, {getElementById:element,querySelectorAll(){return [];},createElement:element}, () => false, {});
const original = '福彩胆码  9  一百元！双飞  39  34  49  各九十元！双飞  59  四十元！三码组选  259  349  159    各二十元！三码直选  394  439  各十元！共计四百九十元！';
const cases = [
  [original, 490, 490],
  [original.replaceAll('！', '!'), 490, 490],
  [original.replaceAll('！', '\n'), 490, 490],
  [original.replace('四百九十元', '五百元'), 490, 500],
  ['体彩胆码8两百元！双飞18 28各三十元！三码组选128各十元！三码直选281各二十元！共计两百九十元！', 290, 290],
  ['福三码组选123 456各二十元！体三码直选789各十元！共计五十元！', 50, 50],
  ['福胆码9一百元', 100, ''],
  ['福三码组选259 349 159各二十元', 60, ''],
  ['福三码直选394 439各十元', 20, '']
];
for (const [text, amount, claimed] of cases) {
  const result = api.autoCalculateBet(text);
  assert.deepEqual([result.amount, result.claimed, result.confident], [amount, claimed, true], JSON.stringify({text, result}));
}
assert.equal(api.extractClaimedAmount(original), 490);
assert.equal(api.autoCalculateBet('福彩胆码9一百元！未知玩法123十元！共计一百一十元！').confident, false);
assert.equal(api.autoCalculateBet('福彩胆码9一百元！双飞39！共计一百一十元！').confident, false);
console.log(`CHINESE_COMPOUND_SUMMARY passed=${cases.length + 3} failed=0`);

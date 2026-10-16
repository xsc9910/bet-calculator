const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet};')({getItem(){return null;},setItem(){}}, {getElementById:element,querySelectorAll(){return [];},createElement:element}, () => false, {});
const original = `体
015 115 128 138 148 155 156 157 158 159 168 178组一米共12
81  51 双飞各10米共20
二码定位
百位8十位1
十位1 个位5 各5米共10
816  810  615  715 817 718 815  819直一倍共16
915 015 115 812 813 814 515直一米共7
816  815  817各4米直一米组选共15
合计共12+20+10+16+7+15=80`;
const cases = [
  [original, 80, 80],
  [original.replace('=80', '=90'), 80, 90],
  ['体816 815 817各4米直一米组选共15', 15, 15],
  ['体\n二码定位\n百位8十位1\n十位1 个位5 各5米共10', 10, 10],
  ['福123 456各3米直两米组选共10', 10, 10],
  ['体246 468各2米组选3米直选共10', 10, 10],
  ['福\n2定码\n十位 859\n个位69 1倍', 60, ''],
  ['福\n2定码\n百位 8\n个位69 2倍', 40, ''],
  ['福，一定 个位0 8五倍100', 100, 100]
];
for (const [text, amount, claimed] of cases) {
  const result = api.autoCalculateBet(text);
  console.log(JSON.stringify({ text, result }));
  assert.deepEqual([result.amount, result.claimed, result.confident], [amount, claimed, true]);
}
console.log(`MIXED_POSITION_PRICED_SUMMARY passed=${cases.length} failed=0`);

const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet};')({ getItem() { return null; }, setItem() {} }, { getElementById: element, querySelectorAll() { return []; }, createElement: element }, () => false, {});
const cases = [
  ['95福组三2倍20元', 20, 20],
  ['088-880-008-808-福单组1元8元', 8, 8],
  ['95福组三2倍20元\n\n\n088-880-008-808-福单组1元8元', 28, 28]
];
for (const lottery of ['福', '体', '福彩', '排列三']) {
  for (const play of ['组三', '组六']) {
    for (const [times, amount] of [['一', 10], ['2', 20], ['三', 30]]) {
      cases.push([`47${lottery}${play}${times}倍${amount}元`, amount, amount]);
    }
  }
}
for (const play of ['直组', '单组', '组直', '组单']) {
  cases.push([`026 026 138体${play}五毛3元`, 3, 3]);
  cases.push([`026 138体${play}2元8元`, 8, 8]);
}
cases.push(['95福组三2倍30元', 20, 30]);
cases.push(['95 95体组三2倍40元', 40, 40]);
cases.push(['95福组三2倍20元\n088-880-008-808-体单组1元8元', 28, 28]);
for (const [text, amount, claimed] of cases) {
  const result = api.autoCalculateBet(text);
  assert.deepEqual([result.amount, result.claimed, result.confident], [amount, claimed, true], JSON.stringify({ text, result }));
}
console.log(`TWO_CODE_AND_SINGLE_GROUP_SUBTOTAL passed=${cases.length}`);

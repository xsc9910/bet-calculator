const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet, scanEntryForDraw};')({ getItem() { return null; }, setItem() {} }, { getElementById: element, querySelectorAll() { return []; }, createElement: element }, () => false, {});
const original = '福沾边13\n组三1倍';
const cases = [[original, 68]];
for (const alias of ['沾边', '粘边', '粘边赖']) {
  for (const separator of ['\n', ' ', '']) {
    for (const lottery of ['福', '体']) {
      cases.push([`${lottery}${alias}47${separator}组三两倍`, 136]);
      cases.push([`${lottery}47${alias}${separator}组三一倍`, 68]);
      cases.push([`${lottery}${alias}47${separator}组六一倍`, 128]);
    }
  }
}
cases.push(['福沾边13\n组三1倍\n合计10', 68]);
cases.push(['福13组三1倍', 10]);
cases.push(['福沾边1组三1倍', 36]);
for (const [source, amount] of cases) {
  const result = api.autoCalculateBet(source);
  assert.deepEqual([result.amount, result.confident], [amount, true], JSON.stringify({ source, result }));
}
for (const [draw, expected] of [['112', 600], ['334', 600], ['123', 0], ['111', 0], ['224', 0]]) {
  const wins = api.scanEntryForDraw({ id: 'sticky-two', original, amount: 68 }, '福彩', draw);
  assert.equal(wins.reduce((total, win) => total + win.prize, 0), expected, JSON.stringify({ draw, wins }));
}
console.log(`STICKY_TWO_DIGITS_SHARED_LINE passed=${cases.length} plus payout checks`);

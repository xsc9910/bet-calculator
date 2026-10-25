const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet, scanEntryForDraw};')({ getItem() { return null; }, setItem() {} }, { getElementById: element, querySelectorAll() { return []; }, createElement: element }, () => false, {});
const original = '体\n百02468\n十02468\n个02468一米125';
const cases = [[original, 125, 125]];
for (const lottery of ['福', '体', '福体']) {
  const factor = lottery === '福体' ? 2 : 1;
  for (const [rate, amount] of [['一米', 8], ['1元', 8], ['两块', 16], ['五毛', 4], ['0.5米', 4]]) {
    for (const separator of ['\n', '，']) {
      cases.push([`${lottery}${separator}百01${separator}十23${separator}个45 ${rate}${amount * factor}`, amount * factor, amount * factor]);
    }
  }
}
cases.push(['体百02468 十02468 个02468一米120', 125, 120]);
cases.push(['体百02468 十02468 个02468一米合计125', 125, 125]);
cases.push(['体百02468 十02468 个02468一米', 125, '']);
for (const [text, amount, claimed] of cases) {
  const result = api.autoCalculateBet(text);
  assert.deepEqual([result.amount, result.claimed, result.confident], [amount, claimed, true], JSON.stringify({ text, result }));
}
const wins = api.scanEntryForDraw({ id: 'position-subtotal', original, amount: 125 }, '体彩', '024');
assert.deepEqual(wins.map(win => [win.stake, win.prize]), [[1, 950]], JSON.stringify(wins));
assert.deepEqual(api.scanEntryForDraw({ id: 'position-subtotal-miss', original, amount: 125 }, '体彩', '125'), []);
console.log(`POSITION_CHINESE_RATE_SUBTOTAL passed=${cases.length} plus payout checks`);

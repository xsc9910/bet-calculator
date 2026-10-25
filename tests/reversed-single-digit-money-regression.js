const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet, scanEntryForDraw};')({ getItem() { return null; }, setItem() {} }, { getElementById: element, querySelectorAll() { return []; }, createElement: element }, () => false, {});
const original = '福彩\n9独码100';
const cases = [[original, 100]];
for (const lottery of ['福', '体彩', '福体']) {
  const factor = lottery === '福体' ? 2 : 1;
  for (const digit of ['0', '4', '9']) {
    for (const alias of ['独码', '独胆']) {
      cases.push([`${lottery}\n${digit}${alias}100`, 100 * factor]);
      cases.push([`${lottery}${digit}${alias}一百元`, 100 * factor]);
      cases.push([`${lottery}${digit}${alias}两倍`, 20 * factor]);
    }
  }
}
cases.push(['福9独码五毛', 0.5]);
cases.push(['福9独码100合计99', 100]);
for (const [text, amount] of cases) {
  const result = api.autoCalculateBet(text);
  assert.deepEqual([result.amount, result.confident], [amount, true], JSON.stringify({ text, result }));
}
assert.equal(api.autoCalculateBet('福9独码100合计99').claimed, 99);
for (const [draw, expected] of [['129', [[100, 350]]], ['999', [[100, 350]]], ['123', []]]) {
  const wins = api.scanEntryForDraw({ id: 'reversed-dan', original, amount: 100 }, '福彩', draw);
  assert.deepEqual(wins.map(win => [win.stake, win.prize]), expected, JSON.stringify({ draw, wins }));
}
console.log(`REVERSED_SINGLE_DIGIT_MONEY passed=${cases.length} plus payout checks`);

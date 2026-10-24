const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet, scanEntryForDraw};')({ getItem() { return null; }, setItem() {} }, { getElementById: element, querySelectorAll() { return []; }, createElement: element }, () => false, {});
const cases = [
  ['体组六013579    10米\n组六357    4米', 14],
  ['体组六013579 10米', 10],
  ['体组六357 4米', 4]
];
for (const lottery of ['福', '体']) {
  for (const label of ['组六', '组三', '组选', '组']) {
    for (const rate of ['4米', '四元', '4块']) {
      cases.push([`${lottery}${label}357 246 各${rate}`, 8]);
      cases.push([`${lottery}${label}357 ${rate}共计4`, 4]);
    }
  }
}
cases.push(['体组六013579 10米\n组六357 4米\n合计14', 14]);
cases.push(['体组六357 357各4米', 8]);
cases.push(['福组六357 246 各五毛', 1]);
cases.push(['体组六357两倍', 4]);
for (const [text, amount] of cases) {
  const result = api.autoCalculateBet(text);
  assert.deepEqual([result.amount, result.confident], [amount, true], JSON.stringify({ text, result }));
}
for (const [original, draw, stake, prize] of [['体组六357 4米', '573', 4, 620], ['体组三557 4米', '575', 4, 1240]]) {
  const wins = api.scanEntryForDraw({ id: 'prefix-group', original, amount: 4 }, '体彩', draw);
  assert.deepEqual(wins.map(win => [win.stake, win.prize]), [[stake, prize]], JSON.stringify(wins));
}
console.log(`SPORTS_INHERITED_GROUP6_MONEY passed=${cases.length}`);

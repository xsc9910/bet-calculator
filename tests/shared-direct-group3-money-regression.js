const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet, scanEntryForDraw, normalizeBetAliases};')({ getItem() { return null; }, setItem() {} }, { getElementById: element, querySelectorAll() { return []; }, createElement: element }, () => false, {});
const original = '体 306 063 一米单组组三一米';
const cases = [[original, 6, '']];
for (const lottery of ['福', '体', '福体']) {
  const factor = lottery === '福体' ? 2 : 1;
  for (const rate of ['一米单组组三一米', '直组各1米，组三1米', '直1元组1元组三1元', '组三1元组1元直1元']) {
    cases.push([`${lottery}306 063 ${rate}`, 6 * factor, '']);
    cases.push([`${lottery}${rate}\n306 063`, 6 * factor, '']);
    cases.push([`${lottery}306 063\n${rate}\n合计99`, 6 * factor, 99]);
  }
}
cases.push(['体306 306一米单组组三一米', 6, '']);
cases.push(['体306 063直2倍组1倍组三2倍', 52, '']);
cases.push(['体306 063直0.2元组五毛组三1米', 3.4, '']);
cases.push(['体306直2米组3米组三4米', 9, '']);
cases.push(['福306直1米组1米组三1米\n体063直2米组2米组三2米\n合计9', 9, 9]);
for (const [text, amount, claimed] of cases) {
  const result = api.autoCalculateBet(text);
  if (result.amount !== amount) console.log(api.normalizeBetAliases(text));
  assert.deepEqual([result.amount, result.claimed, result.confident], [amount, claimed, true], JSON.stringify({ text, result }));
}
for (const [draw, prize, stakes] of [['306', 1260, [1, 1, 1]], ['603', 310, [1, 1]], ['330', 106, [1, 1]], ['333', 0, []], ['123', 0, []]]) {
  const wins = api.scanEntryForDraw({ id: 'shared', original, amount: 6 }, '体彩', draw);
  assert.equal(wins.reduce((sum, win) => sum + win.prize, 0), prize, JSON.stringify({ draw, wins }));
  assert.deepEqual(wins.map(win => win.stake), stakes);
}
assert.equal(api.scanEntryForDraw({ id: 'shared', original, amount: 6 }, '福彩', '306').length, 0);
const unequal = '体306直2米组3米组三4米';
for (const [draw, prize] of [['306', 2365], ['330', 212]]) {
  const wins = api.scanEntryForDraw({ id: 'unequal', original: unequal, amount: 9 }, '体彩', draw);
  assert.equal(wins.reduce((sum, win) => sum + win.prize, 0), prize);
}
console.log(`SHARED_DIRECT_GROUP3_MONEY passed=${cases.length} plus payout checks`);

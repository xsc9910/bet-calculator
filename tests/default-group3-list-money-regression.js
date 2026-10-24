const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet, scanEntryForDraw, parseDefaultGroup3ListMoney};')({ getItem() { return null; }, setItem() {} }, { getElementById: element, querySelectorAll() { return []; }, createElement: element }, () => false, {});
const original = '福23789\n24589各20元';
const cases = [[original, 40, '']];
for (const lottery of ['福', '褔', '体彩', '福体']) {
  for (const separator of ['\n', ' ', '、', '-']) {
    const factor = lottery === '福体' ? 2 : 1;
    cases.push([`${lottery}01357${separator}24689各20米`, 40 * factor, '']);
    cases.push([`${lottery}01357${separator}24689各五毛`, factor, '']);
  }
}
cases.push(['福23789 23789各20元合计40', 40, 40]);
cases.push(['福23789\n24589各20元\n合计50', 40, 50]);
cases.push(['福23789\n24589组六各20元', 40, '']);
for (const [text, amount, claimed] of cases) {
  const result = api.autoCalculateBet(text);
  assert.deepEqual([result.amount, result.claimed, result.confident], [amount, claimed, true], JSON.stringify({ text, result }));
}
for (const [draw, expected] of [['889', [[20, 310], [20, 310]]], ['233', [[20, 310]]], ['258', []], ['888', []], ['001', []]]) {
  const wins = api.scanEntryForDraw({ id: 'default-group3', original, amount: 40 }, '福彩', draw);
  assert.deepEqual(wins.map(win => [win.stake, win.prize]), expected, JSON.stringify({ draw, wins }));
}
for (const source of ['福237 245各20元', '福23789 24589组六各20元', '福23789 24589直选各20元', '福23789 24589各20倍', '福23789 24589各20元双飞', '福23789\n体24589各20元']) {
  assert.equal(api.parseDefaultGroup3ListMoney(source), null, source);
}
console.log(`DEFAULT_GROUP3_LIST_MONEY passed=${cases.length} plus payout checks`);

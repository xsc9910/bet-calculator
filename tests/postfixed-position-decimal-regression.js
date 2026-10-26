const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet, scanEntryForDraw, parseThreePositionTrailingMoney};')({ getItem() { return null; }, setItem() {} }, { getElementById: element, querySelectorAll() { return []; }, createElement: element }, () => false, {});
const original = '百位01369\n十位24678\n个位24589\n福0.5';
const cases = [[original, 62.5, '']];
for (const lottery of ['福', '体彩', '福体']) {
  for (const separator of ['\n', ' ', '，']) {
    const factor = lottery === '福体' ? 2 : 1;
    cases.push([`百位01369${separator}十位24678${separator}个位24589${separator}${lottery}0.5`, 62.5 * factor, '']);
    cases.push([`个位：24589${separator}百位：01369${separator}十位：24678${separator}${lottery}0.2`, 25 * factor, '']);
  }
}
cases.push(['百位01369\n十位24678\n个位24589\n福0.5\n合计60', 62.5, 60]);
cases.push(['百01 十23 个45 体0.5米', 4, '']);
for (const [text, amount, claimed] of cases) {
  const result = api.autoCalculateBet(text);
  assert.deepEqual([result.amount, result.claimed, result.confident], [amount, claimed, true], JSON.stringify({ text, result }));
}
for (const [draw, expected] of [['024', [[0.5, 475]]], ['975', [[0.5, 475]]], ['012', []], ['824', []]]) {
  const wins = api.scanEntryForDraw({ id: 'position-price', original, amount: 62.5 }, '福彩', draw);
  assert.deepEqual(wins.map(win => [win.stake, win.prize]), expected, JSON.stringify({ draw, wins }));
}
// 倍数与裸小数金额分别解释：0.5倍为每注1元，0.5为每注0.5元。
assert.equal(api.parseThreePositionTrailingMoney('百01 十23 个45 福0.5倍').stake, 1);
assert.equal(api.autoCalculateBet('百01 十23 个45 福0.5倍').amount, 8);
for (const text of ['百01 十23 个45 福1', '百01 十23 福0.5', '百01 十23 个45 福0.5 双飞', '百01 十23 个45 福\n百67 十89 个01 体0.5']) assert.equal(api.parseThreePositionTrailingMoney(text), null, text);
assert.equal(api.parseThreePositionTrailingMoney('福百位9 十位0 个位0123456789各0.5元'), null);
console.log(`POSTFIXED_POSITION_DECIMAL passed=${cases.length} plus payout checks`);

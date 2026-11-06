const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet,scanEntryForDraw};')(
  { getItem() { return null; }, setItem() {} },
  { getElementById: element, querySelectorAll() { return []; }, createElement: element }, () => false, {}
);
const original = `福 1 单 1 组
032 038 230 434 636 830 087 447 667 807`;
console.log(JSON.stringify(api.autoCalculateBet(original)));
let checks = 0;
function checkAmount(text, expected, claimed) {
  const result = api.autoCalculateBet(text);
  assert.equal(result.amount, expected, JSON.stringify({ text, result }));
  assert.equal(result.confident, true);
  if (claimed !== undefined) assert.equal(result.claimed, claimed);
  checks++;
}
function checkPrize(text, lottery, draw, expected) {
  const wins = api.scanEntryForDraw({ id: 'counted-header', original: text, amount: 999 }, lottery, draw);
  assert.equal(wins.reduce((sum, win) => sum + win.prize, 0), expected, JSON.stringify({ text, lottery, draw, wins }));
  checks++;
}
checkAmount(original, 40);
checkAmount(original + '\n共41', 40, 41);
checkPrize(original, '福彩', '032', 2520);
checkPrize(original, '福彩', '434', 2520);
checkPrize(original, '体彩', '032', 0);
for (const space of ['', ' ', '  ']) {
  for (const [directText, groupText, direct, group] of [['1', '1', 2, 2], ['2', '3', 4, 6], ['两', '一', 4, 2]]) {
    for (const reverse of [false, true]) {
      const directPlay = `${directText}${space}单`;
      const groupPlay = `${groupText}${space}组`;
      const header = reverse ? `${groupPlay}${space}${directPlay}` : `${directPlay}${space}${groupPlay}`;
      for (const text of [`福 ${header}\n001 001\n112 123`, `福 ${header} 001 001 112 123`, `001 001 112 123 福 ${header}`]) {
        checkAmount(text, 4 * (direct + group));
        checkPrize(text, '福彩', '001', 2 * (direct * 950 + group * 310));
        checkPrize(text, '福彩', '321', group * 155);
      }
      const scoped = `福 ${header}\n001 112\n体 1 单 1 组\n456 455`;
      checkAmount(scoped, 2 * (direct + group) + 8);
      checkPrize(scoped, '福彩', '456', 0);
      checkPrize(scoped, '体彩', '456', 2210);
    }
  }
}
checkAmount('福直1元组2元\n001 112', 6);
assert.equal(api.autoCalculateBet(original + '\n未知玩法99元').confident, false);
console.log(JSON.stringify({ checks: checks + 1, failures: 0 }));

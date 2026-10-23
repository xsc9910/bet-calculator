const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet, scanEntryForDraw};')({ getItem() { return null; }, setItem() {} }, { getElementById: element, querySelectorAll() { return []; }, createElement: element }, () => false, {});
const cases = [['福\n沾边组三一码4三倍合计108', 108, 108]];
for (const sticky of ['沾边', '粘边', '粘边赖']) {
  for (const [play, base] of [['组三', 36], ['组六', 72]]) {
    for (const digit of ['0', '4', '7']) {
      for (const wording of [`${sticky}${play}一码${digit}`, `${play}${sticky}一码${digit}`, `一码${digit}${sticky}${play}`, `一码${sticky}${digit}${play}`]) {
        cases.push([`福${wording}两倍`, base * 2, '']);
      }
    }
  }
}
cases.push(['体沾边组三一码7 5倍合计180', 180, 180]);
cases.push(['福沾边组三一码4三倍合计100', 108, 100]);
cases.push(['福体沾边组三一码4三倍', 216, '']);
for (const [source, amount, claimed] of cases) {
  const result = api.autoCalculateBet(source);
  assert.deepEqual([result.amount, result.claimed, result.confident], [amount, claimed, true], JSON.stringify({ source, result }));
}
for (const [draw, prize] of [['144', 1800], ['114', 1800], ['444', 0], ['123', 0], ['112', 0]]) {
  const wins = api.scanEntryForDraw({ id: 'sticky', original: cases[0][0], amount: 108 }, '福彩', draw);
  assert.equal(wins.reduce((total, win) => total + win.prize, 0), prize, JSON.stringify({ draw, wins }));
  if (prize) assert.equal(wins.length, 1, JSON.stringify(wins));
}
console.log(`STICKY_ONE_CODE_ORDER passed=${cases.length} plus payout checks`);

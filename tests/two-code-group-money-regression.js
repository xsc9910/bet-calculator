const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet};')({getItem(){return null;},setItem(){}}, {getElementById:element,querySelectorAll(){return [];},createElement:element}, () => false, {});
const cases = [];
for (const code of ['47', '58', '02']) {
  for (const play of ['组三', '组六']) {
    for (const [stake, expected] of [['10', 10], ['20', 20], ['10元', 10], ['一倍', 10], ['2倍', 20], ['0.5米', 0.5]]) {
      cases.push([`${code}${play}${stake}`, expected]);
      cases.push([`体${play}${code} ${stake}`, expected]);
    }
  }
}
cases.push(['福47 58组三各10', 20], ['体47 58组六各2倍', 40], ['福47组三10\n体58组六20\n共30', 30]);
cases.push(['体18双飞20', 20], ['体18组三', 10]);
for (const [text, amount] of cases) {
  const result = api.autoCalculateBet(text);
  assert.deepEqual([result.amount, result.confident], [amount, true], JSON.stringify({text, result}));
}
console.log(`TWO_CODE_GROUP_MONEY_SUMMARY passed=${cases.length} failed=0`);

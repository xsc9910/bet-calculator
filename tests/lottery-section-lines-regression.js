const fs = require('fs');
const assert = require('assert/strict');

const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const app = Function('localStorage', 'document', 'confirm', 'navigator', `${fs.readFileSync('app.js', 'utf8')}; return { autoCalculateBet };`)(
  { getItem() { return null; }, setItem() {} },
  { getElementById: element, querySelectorAll() { return []; }, createElement: element },
  () => false,
  {}
);

const source = `福
830，259一直一组，
883.389.522.569.579.333.369.159.355.235.578.775.125.558.378.843.779.478一组
883.388.838三直
388二组
福887一组
福315一直一组

体，245.一直一组
018，015，029一组
合计82`;
const result = app.autoCalculateBet(source);

assert.deepEqual([result.amount, result.claimed, result.confident], [82, 82, true], JSON.stringify(result));
assert.match(result.reasons.join('\n'), /245.*=4元/);
assert.match(result.reasons.join('\n'), /018.*=6元/);
console.log('LOTTERY_SECTION_LINES passed=1 failed=0');

const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet, lotteryTargets};')({getItem(){return null;},setItem(){}}, {getElementById:element,querySelectorAll(){return [];},createElement:element}, () => false, {});
const original = `福0134568组六100.组三30
257转圈一倍12米
658 648 548 546 638 538 536 438 436 435 618 518 516 418 416 415 318 316 315 314 608 508 506 406 405 308 306 305 304 108 106 105 104 301  34注单0.5米17米组2米68
合计227
227一直一组4米
011-112-340-859-913-016-811-886福单组1米16米
14567组六10组三10
合计267米`;
const cases = [
  [original, 267],
  ['福2589、组三组六100合计200', 200],
  ['排直组一倍726，326', 8],
  ['体彩直组两倍726、326', 16],
  ['福直选一倍726，326', 4],
  ['福体直组一倍726/326', 16],
  ['排一直一组一倍726。326', 8],
  ...['.', '。', ',', '，', ';', '；', ' '].flatMap(separator => [
    [`福0134568组六100${separator}组三30`, 130],
    [`体124578组三20${separator}组六40\n123直选一倍`, 62],
    [`福0134568组六1.5元${separator}组三30`, 31.5]
  ])
];
for (const [text, expected] of cases) {
  const result = api.autoCalculateBet(text);
  assert.equal(result.confident, true, JSON.stringify({ text, result }));
  assert.equal(result.amount, expected, JSON.stringify({ text, result }));
}
assert.equal(api.autoCalculateBet(original).claimed, 267);
assert.deepEqual(api.lotteryTargets('排直组一倍726，326'), ['体彩']);
console.log(`GROUP_SEPARATOR_SUMMARY passed=${cases.length} failed=0`);

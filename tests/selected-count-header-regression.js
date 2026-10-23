const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet};')({ getItem() { return null; }, setItem() {} }, { getElementById: element, querySelectorAll() { return []; }, createElement: element }, () => false, {});
const numbers = '432 236 226 327 126 172 034 357 306 073 547 268 629 278 394 367 178 791 189 055 368 544 972 558 038 039 218 129 238 561 329 541 479 849 678 416 046 407 174 988 148 825 967 089 869 299 501 789';
const original = `精选48注 福通用 一直一组\n${numbers}\n合计192`;
const cases = [[original, 192, 192]];
for (const header of ['精选3注 福通用 一直一组', '福通用幸运3注✅️一直一组', '3注精选 一直一组 福彩通用', '通用体精选3注一组一直', '精选3注福体通用一直一组']) {
  cases.push([`${header}\n034 034 278`, header.includes('福体') ? 24 : 12, '']);
}
cases.push(['精选3注 福通用 二直三组\n034 126 278\n合计30', 30, 30]);
cases.push(['精选3注 福通用 一直一组\n034 126 278\n合计99', 12, 99]);
for (const [text, amount, claimed] of cases) {
  const result = api.autoCalculateBet(text);
  assert.deepEqual([result.amount, result.claimed, result.confident], [amount, claimed, true], JSON.stringify({ text, result }));
}
for (const text of [
  '精选4注 福通用 一直一组\n034 126 278\n合计16',
  '精选3注 福通用 一直一组\n034 126 278\n79飞',
  '精选3注 福通用 一直一组\n034 126 2789',
]) {
  assert.equal(api.autoCalculateBet(text).confident, false, text);
}
console.log(`SELECTED_COUNT_HEADER passed=${cases.length + 3}`);

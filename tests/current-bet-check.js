const fs = require('fs');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const app = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + '; return { autoCalculateBet };')({getItem(){return null;},setItem(){}}, {getElementById:element,querySelectorAll(){return[];},createElement:element}, () => false, {});
const assert = require('assert/strict');
const text = `03458福组六2倍
01345福组六2倍
34679福组六2陪
胆8拖013469福组三1倍
胆0拖134589福组六2倍
23457福组六两倍
369 719 427 275一直一组
000豹子一倍
合计128`;
const result = app.autoCalculateBet(text);
assert.deepEqual([result.amount, result.claimed, result.confident], [128, 128, true], JSON.stringify(result));
assert.equal(app.autoCalculateBet(text.replace('34679福组六2陪', '34679福组六2倍')).amount, 128);
assert.equal(app.autoCalculateBet(text.replace('369 719 427 275一直一组', '369 719 427 275一单一组')).amount, 128);
assert.equal(app.autoCalculateBet(text.replaceAll('福', '体')).amount, 128);
console.log('PASS mixed group, dantuo, direct-group, leopard, embedded lottery and 陪 alias');

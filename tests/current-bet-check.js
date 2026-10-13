const fs = require('fs');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const app = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + '; return { autoCalculateBet };')({getItem(){return null;},setItem(){}}, {getElementById:element,querySelectorAll(){return[];},createElement:element}, () => false, {});
const assert = require('assert/strict');
const paragraphText = `福227，277，337，146，377，359各打1倍组选，
十位定0打1倍，

百位定9，
十位定0，
个位0123456789打1倍

百位定0123456789，
十位定0，
个位定9打1倍

2和7双飞1倍，0和9双飞1倍，5和9双飞1倍
共92`;
const result = app.autoCalculateBet(paragraphText);
assert.deepEqual([result.amount, result.claimed, result.confident], [92, 92, true], JSON.stringify(result));
assert.equal(app.autoCalculateBet(paragraphText.replace('各打1倍组选', '组选各1倍')).amount, 92);
assert.equal(app.autoCalculateBet(paragraphText.replace('2和7双飞1倍，0和9双飞1倍，5和9双飞1倍', '双飞27 09 59各1倍')).amount, 92);
const mixedSpecialText = `03458福组六2倍
01345福组六2倍
34679福组六2陪
胆8拖013469福组三1倍
胆0拖134589福组六2倍
23457福组六两倍
369 719 427 275一直一组
000豹子一倍
合计128`;
assert.deepEqual([app.autoCalculateBet(mixedSpecialText).amount, app.autoCalculateBet(mixedSpecialText).claimed], [128, 128]);
assert.equal(app.autoCalculateBet(mixedSpecialText.replace('34679福组六2陪', '34679福组六2倍')).amount, 128);
console.log('PASS blank-line groups, mixed line plays, position grids, shared lottery and 陪 alias');

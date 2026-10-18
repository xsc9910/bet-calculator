const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet};')({getItem(){return null;},setItem(){}}, {getElementById:element,querySelectorAll(){return [];},createElement:element}, () => false, {});

const directAndFly = `福794直2倍组一倍
79双飞5🈴11米`;
const itemized = `福554.545.455三单一组
549.594.945.954一单一组
454.445.544两单一组
904.409.490.一单一组
553.355.535.544.526.625.562.534.564一单一组
574.547.745..475一单一组
844.448.484.一单一组
565.655.556一单一组
501.510.105一单一组
525.522.524.533.566.550.551.554.559组选一倍
540.504.540.450一单一组
559.595.955两单一组
954.945.909.990.099一单一组
529.568.658.586.685一单一组
0跨一倍
888.777.444.555.一倍
659.695.596.532.542.541.514.325.334.433.868.866.686.直组一米
447.445.443.448.449.455.488.559.588.504.574.594.584组选一倍
582.528.546..816一单一组
816三单两组
522.533.544.532.523.542.524.562.526一单一组
福234578组三一倍
合计392`;

for (const [text, expected] of [[directAndFly, 11], [itemized, 392]]) {
  const result = api.autoCalculateBet(text);
  assert.equal(result.confident, true, JSON.stringify({ text, result }));
  assert.equal(result.amount, expected, JSON.stringify({ text, result }));
}
console.log('CURRENT_MULTILINE_INTAKE_SUMMARY passed=2 failed=0');
